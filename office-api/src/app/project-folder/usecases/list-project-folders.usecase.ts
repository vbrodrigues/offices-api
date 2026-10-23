import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectFolder } from '@prisma/client';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { ProjectFoldersRepository } from '../project-folder.repository';

@Injectable()
export class ListProjectFoldersUsecase {
  constructor(
    private projectFoldersRepository: ProjectFoldersRepository,
    private projectsRepository: ProjectsRepository,
  ) {}

  async execute(
    office_id: string,
    project_id: string,
  ): Promise<ProjectFolder[]> {
    const project = await this.projectsRepository.findById(project_id);

    if (!project || office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    return await this.projectFoldersRepository.listByProject(project_id);
  }
}
