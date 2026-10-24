import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProjectPost } from '@prisma/client';
import { ClientJwtAuthGuard } from 'src/auth/client/client-jwt-auth.guard';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { JwtAuthGuard } from 'src/auth/employee/jwt-auth.guard';
import { BaseResponse } from '../common/dtos/responses';
import {
  CreateProjectPostDTO,
  FeedPost,
  FeedQueryDTO,
  ProjectPostLikeDTO,
} from './dtos/project-post.dto';
import { CreateProjectPostUsecase } from './usecases/create-project-post.usecase';
import { GetProjectFeedUsecase } from './usecases/get-project-feed.usecase';
import { LikeProjectPostUsecase } from './usecases/like-project-post.usecase';
import { UnlikeProjectPostUsecase } from './usecases/unlike-project-post.usecase';

interface ClientRequest {
  user: { client_id: string; office_id: string; email: string };
}

// Project feed: the office posts updates, the project's client reads and
// likes them. Not cached, so a like shows up on the next read.
@Controller('/projects')
export class ProjectPostController {
  constructor(
    private createProjectPost: CreateProjectPostUsecase,
    private likeProjectPost: LikeProjectPostUsecase,
    private unlikeProjectPost: UnlikeProjectPostUsecase,
    private getProjectFeed: GetProjectFeedUsecase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/posts')
  async createPost(
    @Request() { user: { office_id, employee_id } }: OfficeRequest,
    @Body() request: CreateProjectPostDTO,
  ): Promise<ProjectPost> {
    return await this.createProjectPost.execute(
      office_id,
      employee_id,
      request,
    );
  }

  @UseGuards(ClientJwtAuthGuard)
  @Post('/posts/like')
  async likePost(
    @Request() { user: { client_id } }: ClientRequest,
    @Body() { project_post_id }: ProjectPostLikeDTO,
  ): Promise<BaseResponse> {
    await this.likeProjectPost.execute(client_id, project_post_id);
    return { success: true, message: 'Successfully liked project post.' };
  }

  @UseGuards(ClientJwtAuthGuard)
  @Post('/posts/unlike')
  async unlikePost(
    @Request() { user: { client_id } }: ClientRequest,
    @Body() { project_post_id }: ProjectPostLikeDTO,
  ): Promise<BaseResponse> {
    await this.unlikeProjectPost.execute(client_id, project_post_id);
    return { success: true, message: 'Successfully unliked project post.' };
  }

  @UseGuards(ClientJwtAuthGuard)
  @Get('/feed/:project_id')
  async getFeed(
    @Request() { user: { client_id } }: ClientRequest,
    @Param('project_id') project_id: string,
    @Query() query: FeedQueryDTO,
  ): Promise<FeedPost[]> {
    return await this.getProjectFeed.execute(client_id, project_id, query);
  }
}
