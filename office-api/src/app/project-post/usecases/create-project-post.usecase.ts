import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectPost } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { decodeBase64 } from 'src/app/common/utils/base64';
import { projectPostMediaKey } from 'src/app/common/utils/storage-keys';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { NotificationsService } from 'src/providers/notifications/notifications.service';
import { StorageService } from 'src/providers/storage/storage';
import { CreateProjectPostDTO } from '../dtos/project-post.dto';
import { ProjectPostsRepository } from '../project-post.repository';

@Injectable()
export class CreateProjectPostUsecase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private projectPostsRepository: ProjectPostsRepository,
    private storageService: StorageService,
    private notificationsService: NotificationsService,
  ) {}

  async execute(
    office_id: string,
    employee_id: string,
    data: CreateProjectPostDTO,
  ): Promise<ProjectPost> {
    const project = await this.projectsRepository.findById(data.project_id);

    if (!project || project.client.office_id !== office_id) {
      throw new UnauthorizedException();
    }

    if (!data.content?.trim() && !data.encoded_media) {
      throw new BadRequestException('A post needs content or media.');
    }

    const project_post_id = uuid();

    let media: string | null = null;
    if (data.encoded_media) {
      media = await this.storageService.uploadFile(
        decodeBase64(data.encoded_media),
        projectPostMediaKey(
          project,
          project_post_id,
          data.encoded_media_format,
        ),
      );
    }

    const post = await this.projectPostsRepository.add({
      id: project_post_id,
      project_id: project.id,
      employee_id,
      content: data.content?.trim() || null,
      media,
    });

    this.notificationsService.notify({
      type: 'EMAIL',
      receiver: project.client.email,
      content: `Nova publicação no projeto ${project.name}`,
    });

    return post;
  }
}
