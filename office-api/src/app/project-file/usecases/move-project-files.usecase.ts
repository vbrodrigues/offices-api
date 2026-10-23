import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { nameKey, uniqueName } from 'src/app/common/utils/unique-name';
import { ProjectFoldersRepository } from 'src/app/project-folder/project-folder.repository';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { MoveProjectFilesDTO } from '../dtos/batch-project-files.dto';
import { ProjectFilesRepository } from '../project-file.repository';

@Injectable()
export class MoveProjectFilesUsecase {
  constructor(
    private projectFilesRepository: ProjectFilesRepository,
    private projectFoldersRepository: ProjectFoldersRepository,
    private projectsRepository: ProjectsRepository,
  ) {}

  // Moves files of one project into a folder, renaming the ones whose name
  // is taken there. Returns the project.
  async execute(
    office_id: string,
    request: MoveProjectFilesDTO,
  ): Promise<string> {
    const first = await this.projectFilesRepository.findById(
      request.file_ids[0],
    );

    if (!first) {
      throw new UnauthorizedException();
    }

    const project = await this.projectsRepository.findById(first.project_id);

    if (!project || office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    const fileIds = new Set(request.file_ids);
    const files = project.files.filter((file) => fileIds.has(file.id));

    // Every file must exist and belong to this same project
    if (files.length !== fileIds.size) {
      throw new UnauthorizedException();
    }

    const folder_id = request.folder_id || null;

    if (folder_id) {
      const folder = await this.projectFoldersRepository.findById(folder_id);

      if (!folder || folder.project_id !== project.id) {
        throw new BadRequestException('Folder not found in the project.');
      }
    }

    const taken = new Set(
      project.files
        .filter((file) => file.folder_id === folder_id && !fileIds.has(file.id))
        .map((file) => nameKey(file.name ?? '')),
    );

    await this.projectFilesRepository.moveMany(
      files.map((file) => ({
        id: file.id,
        folder_id,
        name: uniqueName(file.name ?? '', taken),
      })),
    );

    return project.id;
  }
}
