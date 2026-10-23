import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectFolder } from '@prisma/client';
import { CategoriesRepository } from 'src/app/category/category.repository';
import { nameKey } from 'src/app/common/utils/unique-name';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { CreateProjectFolderDTO } from '../dtos/project-folder.dto';
import { validateTags } from '../folder-tags';
import { ProjectFoldersRepository } from '../project-folder.repository';

@Injectable()
export class CreateProjectFolderUsecase {
  constructor(
    private projectFoldersRepository: ProjectFoldersRepository,
    private projectsRepository: ProjectsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute(
    office_id: string,
    employee_id: string,
    request: CreateProjectFolderDTO,
  ): Promise<ProjectFolder> {
    const project = await this.projectsRepository.findById(request.project_id);

    if (!project || office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    const parent_id = request.parent_id || null;
    const folders = await this.projectFoldersRepository.listByProject(
      project.id,
    );

    if (parent_id && !folders.some((folder) => folder.id === parent_id)) {
      throw new BadRequestException('Parent folder not found in the project.');
    }

    await validateTags(this.categoriesRepository, office_id, project, [
      request,
    ]);

    const name = request.name.trim();
    const siblings = folders.filter((folder) => folder.parent_id === parent_id);

    if (siblings.some((folder) => nameKey(folder.name) === nameKey(name))) {
      throw new BadRequestException('A folder with this name already exists.');
    }

    return await this.projectFoldersRepository.add({
      project_id: project.id,
      parent_id,
      name,
      position: siblings.length,
      category_id: request.category_id || null,
      project_step_id: request.project_step_id || null,
      created_by_id: employee_id,
    });
  }
}
