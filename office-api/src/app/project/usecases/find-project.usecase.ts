import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FullProject, ProjectsRepository } from '../project.repository';

@Injectable()
export class FindProjectUsecase {
  constructor(private projectsRepository: ProjectsRepository) {}

  async execute(
    office_id: string,
    project_id: string,
  ): Promise<FullProject | null> {
    const project = await this.projectsRepository.findById(project_id);

    if (!project) {
      throw new UnauthorizedException();
    }

    if (office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    return project;
  }
}
