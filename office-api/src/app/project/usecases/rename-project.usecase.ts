import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectsRepository } from '../project.repository';

@Injectable()
export class RenameProjectUsecase {
  constructor(private projectsRepository: ProjectsRepository) {}

  async execute(
    office_id: string,
    project_id: string,
    newName: string,
  ): Promise<void> {
    const project = await this.projectsRepository.findById(project_id);

    if (!project) {
      throw new UnauthorizedException();
    }

    if (office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    await this.projectsRepository.update(project_id, { name: newName });
  }
}
