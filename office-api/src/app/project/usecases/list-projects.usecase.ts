import { Injectable } from '@nestjs/common';
import { Project } from '@prisma/client';
import { ProjectFilters } from '../dtos/find-project-filters.dto';
import { ProjectsRepository } from '../project.repository';

@Injectable()
export class ListProjectsUsecase {
  constructor(private projectsRepository: ProjectsRepository) {}

  async execute(
    office_id: string,
    filters: ProjectFilters,
  ): Promise<Project[]> {
    return await this.projectsRepository.findBy(office_id, filters);
  }
}
