import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectLikesRepository } from 'src/app/project-like/project-like.repository';
import { ProjectPostsRepository } from '../project-post.repository';

@Injectable()
export class UnlikeProjectPostUsecase {
  constructor(
    private projectLikesRepository: ProjectLikesRepository,
    private projectPostsRepository: ProjectPostsRepository,
  ) {}

  async execute(project_post_id: string, liker_id: string): Promise<void> {
    const projectPost = await this.projectPostsRepository.findById(
      project_post_id,
    );

    if (!projectPost) {
      throw new UnauthorizedException();
    }

    const like =
      await this.projectLikesRepository.findByProjectPostIdAndLikerId(
        project_post_id,
        liker_id,
      );

    if (like) {
      if (like.is_active) {
        await this.projectLikesRepository.update(like.id, { is_active: false });

        const newLikes = projectPost.likes - 1;
        await this.projectPostsRepository.update(projectPost.id, {
          likes: newLikes,
        });
      }
    }
  }
}
