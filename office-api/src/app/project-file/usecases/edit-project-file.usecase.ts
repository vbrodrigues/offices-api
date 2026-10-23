import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { CategoriesRepository } from 'src/app/category/category.repository';
import { ProjectFilesRepository } from '../project-file.repository';
import { EditProjectFileDTO } from '../dtos/update-project-file.dto';

@Injectable()
export class EditProjectFileUsecase {
  constructor(
    private projectFilesRepository: ProjectFilesRepository,
    private projectsRepository: ProjectsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  // Returns the project the file belongs to
  async execute(
    office_id: string,
    project_file_id: string,
    request: EditProjectFileDTO,
  ): Promise<string> {
    const projectFile = await this.projectFilesRepository.findById(
      project_file_id,
    );

    if (!projectFile) {
      throw new UnauthorizedException();
    }

    const project = await this.projectsRepository.findById(
      projectFile.project_id,
    );

    if (!project || office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    if (request.category_id) {
      const category = await this.categoriesRepository.findById(
        request.category_id,
      );

      if (!category || category.office_id !== office_id) {
        throw new UnauthorizedException();
      }
    }

    if (
      request.project_step_id &&
      !project.project_steps.some((step) => step.id === request.project_step_id)
    ) {
      throw new BadRequestException('Step does not belong to the project.');
    }

    // Only fields present in the request change; null clears them
    await this.projectFilesRepository.update(project_file_id, {
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
