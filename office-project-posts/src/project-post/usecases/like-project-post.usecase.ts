import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectLike } from 'src/database/nosql/models';
import { ProjectPostsRepository } from '../project-post.repository';
import { v4 as uuid } from 'uuid';
import { NotificationsService } from 'src/events/notifications.service';
import { CreateProjectLikeDTO } from 'src/project-like/dtos/create-project-like.dto';
import { ProjectLikesRepository } from 'src/project-like/project-like.repository';

@Injectable()
export class LikeProjectPostUsecase {
  constructor(
    private projectLikesRepository: ProjectLikesRepository,
    private projectPostsRepository: ProjectPostsRepository,
    private notificationsService: NotificationsService,
  ) {}

  async execute(data: CreateProjectLikeDTO): Promise<ProjectLike> {
    console.log('LIKING POST', data.project_post_id);

    const projectPost = await this.projectPostsRepository.findById(
      data.project_post_id,
    );

    if (!projectPost) {
      throw new UnauthorizedException();
    }

    let like: ProjectLike | null;
    like = await this.projectLikesRepository.findByProjectPostIdAndLikerId(
      data.project_post_id,
      data.liker_id,
    );

    if (like) {
      if (!like.is_active) {
        await this.projectLikesRepository.update(like.id, { is_active: true });
        const newLikes = projectPost.likes++;
        await this.projectPostsRepository.update(projectPost.id, {
          likes: newLikes,
        });
      }
    } else {
      like = await this.projectLikesRepository.add({
        ...data,
        id: uuid(),
        is_active: true,
        created_at: new Date(),
      });

      const newLikes = projectPost.likes + 1;
      await this.projectPostsRepository.update(projectPost.id, {
        likes: newLikes,
      });
    }

    try {
      await this.notificationsService.notify({
        type: 'EMAIL',
        content: `${data.liker_name} liked a post!`,
        receiver: 'office.api.vitor@gmail.com',
      });
    } catch (err) {
      console.log('Error notifying post like.');
    }

    return like;
  }
}
