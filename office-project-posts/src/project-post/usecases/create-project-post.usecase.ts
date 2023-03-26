import { Injectable } from '@nestjs/common';
import { ProjectPost } from 'src/database/nosql/models';
import { StorageService } from 'src/providers/storage/storage';
import { CreateProjectPostDTO } from '../dtos/create-project-post.dto';
import { ProjectPostsRepository } from '../project-post.repository';
import { decodeBase64 } from 'src/app/common/utils/base64';
import { v4 as uuid } from 'uuid';
import { NotificationsService } from 'src/events/notifications.service';

@Injectable()
export class CreateProjectPostUsecase {
  constructor(
    private projectPostsRepository: ProjectPostsRepository,
    private storageService: StorageService,
    private notificationsService: NotificationsService,
  ) {}

  async execute(data: CreateProjectPostDTO): Promise<ProjectPost> {
    console.log('CREATING POST', data.content);

    const project_post_id = uuid();

    let mediaStoragePath: string;
    if (data.encoded_media) {
      const mediaFile = decodeBase64(data.encoded_media);
      const mediaFilepath = `offices/${data.office_id}/clients/${data.client_id}/projects/${data.project_id}/posts/${project_post_id}/media/media.${data.encoded_media_format}`;

      mediaStoragePath = await this.storageService.uploadFile(
        mediaFile,
        mediaFilepath,
      );
    }

    await this.notificationsService.notify({
      type: 'CONSOLE',
      content: `${data.employee_id} created a new post on your project!`,
    });

    return await this.projectPostsRepository.add({
      ...data,
      id: project_post_id,
      media_path: mediaStoragePath,
      likes: 0,
      created_at: new Date(),
    });
  }
}
