import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { StorageService } from 'src/providers/storage/storage';
import { ProjectFilesRepository } from '../project-file.repository';

@Injectable()
export class RemoveProjectFileUsecase {
  constructor(
    private projectFilesRepository: ProjectFilesRepository,
    private projectsRepository: ProjectsRepository,
    private storageService: StorageService,
  ) {}

  async execute(office_id: string, project_file_id: string): Promise<void> {
    const projectFile = await this.projectFilesRepository.findById(
      project_file_id,
    );

    if (!projectFile) {
      throw new UnauthorizedException();
    }

    const project = await this.projectsRepository.findById(
      projectFile.project_id,
    );

    if (!project) {
      throw new UnauthorizedException();
    }

    if (office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    const success = await this.storageService.deleteFile(projectFile.path);

    if (!success) {
      throw new InternalServerErrorException(
        'Something went wrong deleting the project file.',
      );
    }

    await this.projectFilesRepository.delete(project_file_id);
  }
}
