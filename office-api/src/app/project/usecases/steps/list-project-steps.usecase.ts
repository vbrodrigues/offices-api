import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectsRepository } from '../../project.repository';
import { ProjectStepsRepository } from 'src/app/project-step/project-step.repository';

@Injectable()
export class ListProjectStepsUsecase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private projectStepsRepository: ProjectStepsRepository,
  ) {}

  async execute(project_id: string) {
    const project = await this.projectsRepository.findById(project_id);

    if (!project) {
      throw new UnauthorizedException();
    }

    return this.projectStepsRepository.findByProject(project_id);
  }
}
