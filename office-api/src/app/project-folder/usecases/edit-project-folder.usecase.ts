import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CategoriesRepository } from 'src/app/category/category.repository';
import { folderWithDescendants } from 'src/app/common/utils/folder-tree';
import { nameKey } from 'src/app/common/utils/unique-name';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { EditProjectFolderDTO } from '../dtos/project-folder.dto';
import { validateTags } from '../folder-tags';
import { ProjectFoldersRepository } from '../project-folder.repository';

@Injectable()
export class EditProjectFolderUsecase {
  constructor(
    private projectFoldersRepository: ProjectFoldersRepository,
    private projectsRepository: ProjectsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  // Renames, moves, reorders or retags a folder. Returns its project.
  async execute(
    office_id: string,
    project_folder_id: string,
    request: EditProjectFolderDTO,
  ): Promise<string> {
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
    const moving = request.parent_id !== undefined;
    const parent_id = moving ? request.parent_id || null : folder.parent_id;

    if (moving && parent_id) {
      if (!folders.some((other) => other.id === parent_id)) {
        throw new BadRequestException(
          'Parent folder not found in the project.',
        );
      }

      if (folderWithDescendants(folders, folder.id).includes(parent_id)) {
        throw new BadRequestException(
          'A folder cannot be moved into itself or one of its subfolders.',
        );
      }
    }

    await validateTags(this.categoriesRepository, office_id, project, [
      request,
    ]);

    const name = request.name !== undefined ? request.name.trim() : folder.name;
    const siblings = folders.filter(
      (other) => other.parent_id === parent_id && other.id !== folder.id,
    );

    if (siblings.some((other) => nameKey(other.name) === nameKey(name))) {
      throw new BadRequestException('A folder with this name already exists.');
    }

    // A moved folder goes to the end of its new parent unless told otherwise
    const changedParent = parent_id !== folder.parent_id;
    const position =
      request.position ?? (changedParent ? siblings.length : undefined);

    await this.projectFoldersRepository.update(folder.id, {
      ...(request.name !== undefined && { name }),
      ...(changedParent && { parent_id }),
      ...(position !== undefined && { position }),
      ...(request.category_id !== undefined && {
        category_id: request.category_id,
      }),
      ...(request.project_step_id !== undefined && {
        project_step_id: request.project_step_id,
      }),
    });

    return project.id;
  }
}
