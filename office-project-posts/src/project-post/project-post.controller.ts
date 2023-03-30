import { Controller, Get, Query } from '@nestjs/common';
import { CreateProjectPostUsecase } from './usecases/create-project-post.usecase';
import { CreateProjectPostDTO } from './dtos/create-project-post.dto';
import { ProjectPost } from 'src/database/nosql/models';
import { GetProjectFeedUsecase } from './usecases/get-project-feed.usecase';
import { LikeProjectPostUsecase } from './usecases/like-project-post.usecase';
import { UnlikeProjectPostUsecase } from './usecases/unlike-project-post.usecase';
import { CreateProjectLikeDTO } from '../project-like/dtos/create-project-like.dto';
import { MessagePattern } from '@nestjs/microservices';
import { UnlikeProjectPostDTO } from 'src/project-like/dtos/update-project-like.dto';
import { Param } from '@nestjs/common/decorators';

@Controller('/project-posts')
export class ProjectPostController {
  constructor(
    private createProjectPost: CreateProjectPostUsecase,
    private getProjectFeed: GetProjectFeedUsecase,
    private likeProjectPost: LikeProjectPostUsecase,
    private unlikeProjectPost: UnlikeProjectPostUsecase,
  ) {}

  @MessagePattern('office-create-project-post')
  async create(data: CreateProjectPostDTO) {
    return await this.createProjectPost.execute(data);
  }

  @MessagePattern('office-like-project-post')
  async like(request: CreateProjectLikeDTO) {
    console.log(request);
    return await this.likeProjectPost.execute(request);
  }

  @MessagePattern('office-unlike-project-post')
  async unlike(request: UnlikeProjectPostDTO) {
    await this.unlikeProjectPost.execute(
      request.project_post_id,
      request.liker_id,
    );
    return { success: true, message: 'Successfully unliked post.' };
  }

  @Get('/feed/:project_id')
  async show(@Param('project_id') project_id: string): Promise<ProjectPost[]> {
    return await this.getProjectFeed.execute(project_id, {
      limit: 10,
      offset: 0,
      ordering: 'DESC',
      sortField: 'created_at',
    });
  }
}
