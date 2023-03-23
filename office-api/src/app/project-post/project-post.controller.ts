import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Request } from '@nestjs/common/decorators/http/route-params.decorator';
import { JwtAuthGuard } from 'src/auth/employee/jwt-auth.guard';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { CreateProjectPostUsecase } from './usecases/create-project-post.usecase';
import { CreateProjectPostDTO } from './dtos/create-project-post.dto';
import { ProjectLike, ProjectPost } from 'src/database/nosql/models';
import { ClientJwtAuthGuard } from 'src/auth/client/client-jwt-auth.guard';
import { GetProjectFeedUsecase } from './usecases/get-project-feed.usecase';
import { LikeProjectPostUsecase } from './usecases/like-project-post.usecase';
import { UnlikeProjectPostUsecase } from './usecases/unlike-project-post.usecase';
import { CreateProjectLikeDTO } from '../project-like/dtos/create-project-like.dto';
import { BaseResponse } from '../common/dtos/responses';

@Controller('/project-posts')
export class ProjectPostController {
  constructor(
    private createProjectPost: CreateProjectPostUsecase,
    private getProjectFeed: GetProjectFeedUsecase,
    private likeProjectPost: LikeProjectPostUsecase,
    private unlikeProjectPost: UnlikeProjectPostUsecase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() { user: { office_id } }: OfficeRequest,
    @Body() request: CreateProjectPostDTO,
  ): Promise<ProjectPost> {
    return await this.createProjectPost.execute(office_id, request);
  }

  @UseGuards(JwtAuthGuard, ClientJwtAuthGuard)
  @Post('/like')
  async like(@Body() request: CreateProjectLikeDTO): Promise<ProjectLike> {
    return await this.likeProjectPost.execute(request);
  }

  @UseGuards(JwtAuthGuard, ClientJwtAuthGuard)
  @Post('/unlike')
  async unlike(
    @Body() request: { project_post_id: string; liker_id: string },
  ): Promise<BaseResponse> {
    await this.unlikeProjectPost.execute(
      request.project_post_id,
      request.liker_id,
    );
    return { success: true, message: 'Successfully unliked post.' };
  }

  @UseGuards(JwtAuthGuard, ClientJwtAuthGuard)
  @Get()
  async show(
    @Request() { user: { office_id } }: OfficeRequest,
    @Query('project_id') project_id: string,
  ): Promise<ProjectPost[]> {
    return await this.getProjectFeed.execute(office_id, project_id, {
      limit: 10,
      offset: 0,
      ordering: 'DESC',
      sortField: 'created_at',
    });
  }
}
