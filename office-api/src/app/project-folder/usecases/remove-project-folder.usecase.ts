import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { can, Permission } from 'src/auth/employee/permissions';
import { folderWithDescendants } from 'src/app/common/utils/folder-tree';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { StorageService } from 'src/providers/storage/storage';
import { ProjectFoldersRepository } from '../project-folder.repository';

// How many storage objects are deleted at the same time
const DELETE_CONCURRENCY = 20;

export interface RemovedFolderSummary {
  project_id: string;
  folders: number;
  files: number;
}

@Injectable()
export class RemoveProjectFolderUsecase {
  constructor(
    private projectFoldersRepository: ProjectFoldersRepository,
    private projectsRepository: ProjectsRepository,
    private storageService: StorageService,
  ) {}

  // Deletes the folder with all its subfolders and files
  async execute(
    caller: OfficeRequest['user'],
    project_folder_id: string,
  ): Promise<RemovedFolderSummary> {
    const { office_id } = caller;
    const folder = await this.projectFoldersRepository.findById(
      project_folder_id,
    );

    if (!folder) {
      throw new UnauthorizedException();
    }

    const project = await this.projectsRepository.findById(folder.project_id);

    if (!project || office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    const folders = await this.projectFoldersRepository.listByProject(
      project.id,
    );
    const folderIds = new Set(folderWithDescendants(folders, folder.id));
    const files = project.files.filter((file) => folderIds.has(file.folder_id));

    // Deleting a folder deletes its files, so the same rule as for files
    if (
      files.some((file) => file.created_by_id !== caller.employee_id) &&
      !can(caller.access_level, Permission.DELETE_ANY_FILE)
    ) {
      throw new ForbiddenException(
        'The folder has files uploaded by others; only partners can delete it.',
      );
    }

    // Rows go away even if some objects can't be deleted: a leftover object
    // only costs storage, while a row without its object is a broken file.
    const paths = files.map((file) => file.path).filter(Boolean);

    for (let i = 0; i < paths.length; i += DELETE_CONCURRENCY) {
      const chunk = paths.slice(i, i + DELETE_CONCURRENCY);
      const results = await Promise.all(
        chunk.map((path) => this.storageService.deleteFile(path)),
      );

      results.forEach((deleted, index) => {
        if (!deleted) {
          console.log('Orphan storage object left behind:', chunk[index]);
        }
      });
    }

    await this.projectFoldersRepository.deleteWithFiles(
      [...folderIds],
      files.map((file) => file.id),
    );

    return {
      project_id: project.id,
      folders: folderIds.size,
      files: files.length,
    };
  }
}
