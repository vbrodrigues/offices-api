import {
  Body,
  Controller,
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
import { CreateProjectPostDTO } from './dtos/create-project-posts.dto';
import { ProjectPost } from 'src/database/nosql/models';
import { ClientJwtAuthGuard } from 'src/auth/client/client-jwt-auth.guard';
import { GetProjectFeedUsecase } from './usecases/get-project-feed.usecase';

@Controller('/project-posts')
export class ProjectPostController {
  constructor(
    private createProjectPost: CreateProjectPostUsecase,
    private getProjectFeed: GetProjectFeedUsecase,
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
