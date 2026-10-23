import { Injectable, UnauthorizedException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { extensionOf, projectFileKey } from 'src/app/common/utils/storage-keys';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { StorageService } from 'src/providers/storage/storage';
import {
  ProjectFileUpload,
  RequestProjectFileUploadsDTO,
} from '../dtos/batch-project-files.dto';

const DEFAULT_CONTENT_TYPE = 'application/octet-stream';

// First step of a batch upload: hands out one presigned URL per file, so the
// browser sends the bytes straight to storage. Nothing is saved until the
// batch is confirmed with POST /project-files/batch.
@Injectable()
export class RequestProjectFileUploadsUsecase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private storageService: StorageService,
  ) {}

  async execute(
    office_id: string,
    request: RequestProjectFileUploadsDTO,
  ): Promise<ProjectFileUpload[]> {
    const project = await this.projectsRepository.findById(request.project_id);

    if (!project || office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    return await Promise.all(
      request.files.map(async (file) => {
        const content_type = file.content_type || DEFAULT_CONTENT_TYPE;
        const key = projectFileKey(project, uuid(), extensionOf(file.name));

        return {
          name: file.name,
          relative_path: file.relative_path || null,
          key,
          url: await this.storageService.getUploadUrl(key, content_type),
          content_type,
        };
      }),
    );
  }
}
