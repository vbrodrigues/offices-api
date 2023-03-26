import { Injectable } from '@nestjs/common';
import { UnlikeProjectPostDTO } from 'src/events/project-posts/project-posts.dto';
import { ProjectPostsService } from 'src/events/project-posts/project-posts.service';

@Injectable()
export class UnlikeProjectPostUsecase {
  constructor(private projectPostsService: ProjectPostsService) {}

  async execute(data: UnlikeProjectPostDTO): Promise<void> {
    await this.projectPostsService.unlike(data);
  }
}
