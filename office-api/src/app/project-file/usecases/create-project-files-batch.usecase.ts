import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectFile, ProjectFolder } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { CategoriesRepository } from 'src/app/category/category.repository';
import { parentKey } from 'src/app/common/utils/folder-tree';
import { projectFilesPrefix } from 'src/app/common/utils/storage-keys';
import { nameKey, uniqueName } from 'src/app/common/utils/unique-name';
import { EmployeesRepository } from 'src/app/employee/employee.repository';
import { CreateProjectFolderInternalDTO } from 'src/app/project-folder/dtos/project-folder.dto';
import { validateTags } from 'src/app/project-folder/folder-tags';
import { ProjectFoldersRepository } from 'src/app/project-folder/project-folder.repository';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { NotificationsService } from 'src/events/notifications/notifications.service';
import { StorageService } from 'src/providers/storage/storage';
import { CreateProjectFilesBatchDTO } from '../dtos/batch-project-files.dto';
import { CreateProjectFileInternalDTO } from '../dtos/create-project-file.dto';
import { ProjectFilesRepository } from '../project-file.repository';

// How many storage lookups run at the same time
const EXISTS_CONCURRENCY = 20;

// What follows the project prefix in keys made by projectFileKey()
const GENERATED_KEY_PATTERN = /^[0-9a-f-]{36}(\.[a-zA-Z0-9]{1,16})?$/;

type NewFolder = CreateProjectFolderInternalDTO & { id: string };
type FolderLike = Pick<
  ProjectFolder,
  'id' | 'parent_id' | 'name' | 'category_id' | 'project_step_id'
>;

// Second step of a batch upload: after the browser PUT every file to its
// presigned URL, saves them (and the folders of their relative paths) at once.
@Injectable()
export class CreateProjectFilesBatchUsecase {
  constructor(
    private projectFilesRepository: ProjectFilesRepository,
    private projectFoldersRepository: ProjectFoldersRepository,
    private projectsRepository: ProjectsRepository,
    private employeesRepository: EmployeesRepository,
    private categoriesRepository: CategoriesRepository,
    private storageService: StorageService,
    private notificationsService: NotificationsService,
  ) {}

  async execute(
    office_id: string,
    employee_id: string,
    request: CreateProjectFilesBatchDTO,
  ): Promise<ProjectFile[]> {
    const project = await this.projectsRepository.findById(request.project_id);

    if (!project || office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    const employee = await this.employeesRepository.findById(employee_id);

    if (!employee || office_id !== employee.office_id) {
      throw new UnauthorizedException();
    }

    const folders = await this.projectFoldersRepository.listByProject(
      project.id,
    );
    const target = request.folder_id
      ? folders.find((folder) => folder.id === request.folder_id)
      : null;

    if (request.folder_id && !target) {
      throw new BadRequestException('Folder not found in the project.');
    }

    await this.validateKeys(project, request);
    await validateTags(
      this.categoriesRepository,
      office_id,
      project,
      request.files,
    );

    // Lookups of what is already directly inside each folder, by parentKey()
    const childFolders = new Map<string, Map<string, FolderLike>>();
    const takenFileNames = new Map<string, Set<string>>();
    const newFolders: NewFolder[] = [];

    const childrenOf = (parent_id: string | null) => {
      const key = parentKey(parent_id);
      if (!childFolders.has(key)) childFolders.set(key, new Map());
      return childFolders.get(key);
    };

    const fileNamesIn = (folder_id: string | null) => {
      const key = parentKey(folder_id);
      if (!takenFileNames.has(key)) takenFileNames.set(key, new Set());
      return takenFileNames.get(key);
    };

    folders.forEach((folder) =>
      childrenOf(folder.parent_id).set(nameKey(folder.name), folder),
    );
    project.files.forEach((file) => {
      if (file.name) fileNamesIn(file.folder_id).add(nameKey(file.name));
    });

    // Walks relative_path from the target folder, reusing folders that
    // already exist with the same name and creating the missing ones. New
    // folders take their parent's default tags.
    const resolveFolder = (relative_path?: string): FolderLike | null => {
      const segments = (relative_path || '')
        .split(/[/\\]/)
        .map((segment) => segment.trim())
        .filter(Boolean);

      let current: FolderLike | null = target;

      for (const segment of segments) {
        if (segment === '.' || segment === '..' || segment.length > 255) {
          throw new BadRequestException(`Invalid folder name: ${segment}`);
        }

        const siblings = childrenOf(current?.id ?? null);
        let child = siblings.get(nameKey(segment));

        if (!child) {
          const folder: NewFolder = {
            id: uuid(),
            project_id: project.id,
            parent_id: current?.id ?? null,
            name: segment,
            position: siblings.size,
            category_id: current?.category_id ?? null,
            project_step_id: current?.project_step_id ?? null,
            created_by_id: employee_id,
          };
          newFolders.push(folder);
          siblings.set(nameKey(segment), folder);
          child = folder;
        }

        current = child;
      }

      return current;
    };

    const newFiles: (CreateProjectFileInternalDTO & { id: string })[] =
      request.files.map((file) => {
        const folder = resolveFolder(file.relative_path);
        const folder_id = folder?.id ?? null;

        return {
          id: uuid(),
          project_id: project.id,
          folder_id,
          created_by_id: employee_id,
          path: file.key,
          name: uniqueName(file.name.trim(), fileNamesIn(folder_id)),
          size: file.size,
          content_type: file.content_type || null,
          category_id:
            file.category_id !== undefined
              ? file.category_id || null
              : folder?.category_id ?? null,
          project_step_id:
            file.project_step_id !== undefined
              ? file.project_step_id || null
              : folder?.project_step_id ?? null,
        };
      });

    const created = await this.projectFilesRepository.addBatch(
      newFolders,
      newFiles,
    );

    this.notifyOffice(office_id, employee, project.name, created.files.length);

    created.files.forEach((file) => delete file.path);

    return created.files;
  }

  // Keys must be ones this project's upload step could have handed out,
  // uploaded for real, and not already used by another file.
  private async validateKeys(
    project: Parameters<typeof projectFilesPrefix>[0],
    request: CreateProjectFilesBatchDTO,
  ): Promise<void> {
    const prefix = projectFilesPrefix(project);
    const keys = request.files.map((file) => file.key);

    if (
      keys.some(
        (key) =>
          !key.startsWith(prefix) ||
          !GENERATED_KEY_PATTERN.test(key.slice(prefix.length)),
      )
    ) {
      throw new UnauthorizedException();
    }

    if (new Set(keys).size !== keys.length) {
      throw new BadRequestException('The same upload was sent twice.');
    }

    const alreadySaved = await this.projectFilesRepository.findByPaths(keys);

    if (alreadySaved.length > 0) {
      throw new BadRequestException('Some uploads were already saved.');
    }

    const missing: string[] = [];

    for (let i = 0; i < request.files.length; i += EXISTS_CONCURRENCY) {
      const chunk = request.files.slice(i, i + EXISTS_CONCURRENCY);
      const found = await Promise.all(
        chunk.map((file) => this.storageService.exists(file.key)),
      );

      chunk.forEach((file, index) => {
        if (!found[index]) missing.push(file.name);
      });
    }

    if (missing.length > 0) {
      throw new BadRequestException(
        `Upload not found for: ${missing.join(', ')}`,
      );
    }
  }

  // One message per batch, not per file
  private notifyOffice(
    office_id: string,
    employee: { id: string; name: string },
    projectName: string,
    count: number,
  ) {
    const content =
      count === 1
        ? `Novo arquivo adicionado por ${employee.name} ao projeto ${projectName}`
        : `${count} novos arquivos adicionados por ${employee.name} ao projeto ${projectName}`;

    // Fire-and-forget; a failed notification must not crash the process
    this.employeesRepository
      .findByOfficeId(office_id)
      .then((employees) =>
        employees.forEach((notifiedEmployee) => {
          if (notifiedEmployee.id !== employee.id) {
            this.notificationsService
              .notify({
                content,
                type: 'EMAIL',
                receiver: notifiedEmployee.email,
              })
              .catch((err) => console.log('Error notifying employee:', err));
          }
        }),
      )
      .catch((err) => console.log('Error notifying employees:', err));
  }
}
