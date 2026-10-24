import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { ProjectPostsRepository } from '../project-post.repository';

@Injectable()
export class UnlikeProjectPostUsecase {
  constructor(
    private projectPostsRepository: ProjectPostsRepository,
    private projectsRepository: ProjectsRepository,
  ) {}

  async execute(client_id: string, project_post_id: string): Promise<void> {
    const post = await this.projectPostsRepository.findById(project_post_id);
    const project =
      post && (await this.projectsRepository.findById(post.project_id));

    if (!project || project.client_id !== client_id) {
      throw new UnauthorizedException();
    }

    await this.projectPostsRepository.unlike(project_post_id, client_id);
  }
}
