import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectStatus } from '../dtos/update-project.dto';
import { ProjectsRepository } from '../project.repository';

@Injectable()
export class UpdateProjectStatusUsecase {
  constructor(private projectsRepository: ProjectsRepository) {}

  async execute(
    office_id: string,
    project_id: string,
    newStatus: ProjectStatus,
  ): Promise<void> {
    const project = await this.projectsRepository.findById(project_id);

    if (!project) {
      throw new UnauthorizedException();
    }

    if (office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    await this.projectsRepository.update(project_id, { status: newStatus });
  }
}
