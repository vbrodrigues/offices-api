import { Injectable } from '@nestjs/common';
import { StorageService } from 'src/providers/storage/storage';
import { ProjectFilters } from '../dtos/find-project-filters.dto';
import { FullProject, ProjectsRepository } from '../project.repository';

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

    return Promise.all(
      projects.map(async (project) => {
        if (project.files) {
          project.files = await Promise.all(
            project.files.map(async (file) => {
              file.path = await this.storageService.signFile(file.path);
              return file;
            }),
          );
        }

        return project;
      }),
    );
  }
}
