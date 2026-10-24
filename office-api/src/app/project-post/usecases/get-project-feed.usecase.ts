import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { StorageService } from 'src/providers/storage/storage';
import { FeedPost, FeedQueryDTO } from '../dtos/project-post.dto';
import { ProjectPostsRepository } from '../project-post.repository';

@Injectable()
export class GetProjectFeedUsecase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private projectPostsRepository: ProjectPostsRepository,
    private storageService: StorageService,
  ) {}

  // The feed of one of the client's own projects, newest first by default
  async execute(
    client_id: string,
    project_id: string,
    query: FeedQueryDTO,
  ): Promise<FeedPost[]> {
    const project = await this.projectsRepository.findById(project_id);

    if (!project || project.client_id !== client_id) {
      throw new UnauthorizedException();
    }

    const posts = await this.projectPostsRepository.listByProject(
      project_id,
      client_id,
      {
        ordering: query.ordering?.toLowerCase() === 'asc' ? 'asc' : 'desc',
        offset: query.offset ?? 0,
        limit: query.limit ?? 10,
      },
    );

    return await Promise.all(
      posts.map(async (post) => ({
        id: post.id,
        project_id: post.project_id,
        content: post.content,
        media_url: post.media
          ? await this.storageService.signFile(post.media)
          : null,
        created_at: post.created_at,
        author: post.employee,
        likes: post._count.likes,
        liked: post.likes.length > 0,
      })),
    );
  }
}
