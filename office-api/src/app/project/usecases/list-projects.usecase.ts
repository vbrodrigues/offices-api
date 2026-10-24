import { Injectable } from '@nestjs/common';
import { StorageService } from 'src/providers/storage/storage';
import { ProjectFilters } from '../dtos/find-project-filters.dto';
import { FullProject, ProjectsRepository } from '../project.repository';
import { signProject } from '../sign-project';

@Injectable()
export class ListProjectsUsecase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private storageService: StorageService,
  ) {}

  async execute(
    office_id: string,
    filters: ProjectFilters,
  ): Promise<FullProject[]> {
    const projects = await this.projectsRepository.findBy(office_id, filters);

    return await Promise.all(
      projects.map((project) => signProject(project, this.storageService)),
    );
  }
}
