import { Injectable } from '@nestjs/common';
import { ProjectFilters } from '../dtos/find-project-filters.dto';
import { FullProject, ProjectsRepository } from '../project.repository';

@Injectable()
export class ListProjectsUsecase {
  constructor(private projectsRepository: ProjectsRepository) {}

  async execute(
    office_id: string,
    filters: ProjectFilters,
  ): Promise<FullProject[]> {
    return await this.projectsRepository.findBy(office_id, filters);
  }
}
