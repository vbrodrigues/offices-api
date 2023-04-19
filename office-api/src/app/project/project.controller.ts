import {
  Body,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Project } from '@prisma/client';
import {
  Param,
  Request,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { CreateProjectDTO } from './dtos/create-project.dto';
import { CreateProjectUsecase } from './usecases/create-project.usecase';
import { ListProjectsUsecase } from './usecases/list-projects.usecase';
import { BaseResponse } from '../common/dtos/responses';
import { RenameProjectUsecase } from './usecases/rename-project.usecase';
import { FindProjectUsecase } from './usecases/find-project.usecase';
import { FullProject } from './project.repository';
import { JwtAuthGuard } from 'src/auth/employee/jwt-auth.guard';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { ClientJwtAuthGuard } from 'src/auth/client/client-jwt-auth.guard';
import { LikeProjectPostUsecase } from './usecases/posts/like-project-post.usecase';
import { UnlikeProjectPostUsecase } from './usecases/posts/unlike-project-post.usecase';
import { CreateProjectPostUsecase } from './usecases/posts/create-project-post.usecase';
import { GetProjectFeedUsecase } from './usecases/posts/get-project-feed.usecase';
import {
  CreateProjectPostDTO,
  LikeProjectPostDTO,
  ProjectPost,
  UnlikeProjectPostDTO,
} from 'src/events/project-posts/project-posts.dto';
import { Cache } from 'cache-manager';

@Controller('/projects')
export class ProjectController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private createProject: CreateProjectUsecase,
    private listProjects: ListProjectsUsecase,
    private renameProject: RenameProjectUsecase,
    private findProject: FindProjectUsecase,
    private likeProjectPost: LikeProjectPostUsecase,
    private unlikeProjectPost: UnlikeProjectPostUsecase,
    private createProjectPost: CreateProjectPostUsecase,
    private getProjectFeed: GetProjectFeedUsecase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() { user: { office_id, employee_id } }: OfficeRequest,
    @Body() request: CreateProjectDTO,
  ): Promise<Project> {
    return await this.createProject.execute(office_id, employee_id, request);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async show(
    @Request() { user: { office_id } }: OfficeRequest,
    @Query('client_id') client_id: string,
    @Query('name') name: string,
  ): Promise<FullProject[]> {
    const cachedResponse: FullProject[] = await this.cacheManager.get(
      `projects-${office_id}-${client_id}-${name}`,
    );

    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await this.listProjects.execute(office_id, {
      client_id,
      name,
    });

    if (response) {
      await this.cacheManager.set(
        `projects-${office_id}-${client_id}-${name}`,
        response,
        5000,
      );
    }

    return response;
  }

  @UseGuards(ClientJwtAuthGuard)
  @Get('/clients')
  async showForClient(
    @Request() { user: { office_id } }: OfficeRequest,
    @Query('client_id') client_id: string,
    @Query('name') name: string,
  ): Promise<FullProject[]> {
    const cachedResponse: FullProject[] = await this.cacheManager.get(
      `projects-${office_id}-${client_id}-${name}`,
    );

    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await this.listProjects.execute(office_id, {
      client_id,
      name,
    });

    if (response) {
      await this.cacheManager.set(
        `projects-${office_id}-${client_id}-${name}`,
        response,
        5000,
      );
    }

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:project_id/rename')
  async rename(
    @Request()
    { user: { office_id } }: OfficeRequest,
    @Param('project_id') project_id: string,
    @Body() data: { name: string },
  ): Promise<BaseResponse> {
    await this.renameProject.execute(office_id, project_id, data.name);
    return { success: true, message: 'Project renamed successfully.' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:project_id')
  async index(
    @Request() { user: { office_id } }: OfficeRequest,
    @Param('project_id') project_id: string,
  ): Promise<FullProject | null> {
    const cachedResponse: FullProject = await this.cacheManager.get(
      `project-${office_id}-${project_id}`,
    );

    if (cachedResponse) {
      return cachedResponse;
    }
    const response = await this.findProject.execute(office_id, project_id);

    if (response) {
      await this.cacheManager.set(
        `project-${office_id}-${project_id}`,
        response,
        5000,
      );
    }

    return response;
  }

  @UseGuards(JwtAuthGuard, ClientJwtAuthGuard)
  @Get('clients/:project_id')
  async indexForClient(
    @Request() { user: { office_id } }: OfficeRequest,
    @Param('project_id') project_id: string,
  ): Promise<FullProject | null> {
    const cachedResponse: FullProject = await this.cacheManager.get(
      `project-${office_id}-${project_id}`,
    );

    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await this.findProject.execute(office_id, project_id);

    if (response) {
      await this.cacheManager.set(
        `project-${office_id}-${project_id}`,
        response,
        5000,
      );
    }

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/posts')
  async createPost(
    @Request() { user: { office_id } }: OfficeRequest,
    @Body() request: CreateProjectPostDTO,
  ): Promise<BaseResponse> {
    await this.createProjectPost.execute(office_id, request);
    return { success: true, message: 'Successfully created project post.' };
  }

  @UseGuards(ClientJwtAuthGuard)
  @Post('/posts/like')
  async likePost(@Body() request: LikeProjectPostDTO): Promise<BaseResponse> {
    await this.likeProjectPost.execute(request);
    return { success: true, message: 'Successfully liked project post.' };
  }

  @UseGuards(ClientJwtAuthGuard)
  @Post('/posts/unlike')
  async unlikePost(
    @Body() request: UnlikeProjectPostDTO,
  ): Promise<BaseResponse> {
    await this.unlikeProjectPost.execute(request);
    return { success: true, message: 'Successfully unliked project post.' };
  }

  @UseGuards(ClientJwtAuthGuard)
  @Get('/feed/:project_id')
  async getFeed(
    @Request() { user: { office_id } }: OfficeRequest,
    @Param('project_id') project_id: string,
    @Query('ordering') ordering: 'ASC' | 'DESC',
    @Query('sortField') sortField: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
  ): Promise<ProjectPost[]> {
    const cachedResponse: ProjectPost[] = await this.cacheManager.get(
      `project-feed-${office_id}-${project_id}-${ordering}-${sortField}-${offset}-${limit}`,
    );

    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await this.getProjectFeed.execute(office_id, project_id, {
      ordering,
      sortField,
      offset,
      limit,
    });

    if (response) {
      await this.cacheManager.set(
        `project-feed-${office_id}-${project_id}-${ordering}-${sortField}-${offset}-${limit}`,
        response,
        15000,
      );
    }

    return response;
  }
}
