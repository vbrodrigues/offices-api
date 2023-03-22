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

@Controller('/project-posts')
export class ProjectPostController {
  constructor(
    private createProjectPost: CreateProjectPostUsecase, //   private listProjects: ListProjectsUsecase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() { user: { office_id } }: OfficeRequest,
    @Body() request: CreateProjectPostDTO,
  ): Promise<ProjectPost> {
    return await this.createProjectPost.execute(office_id, request);
  }

  // @UseGuards(JwtAuthGuard, ClientJwtAuthGuard)
  // @Get()
  // async show(
  //   @Request() { user: { office_id } }: OfficeRequest,
  //   @Query('client_id') client_id: string,
  //   @Query('project_type_id') project_type_id: string,
  //   @Query('name') name: string,
  // ): Promise<FullProject[]> {
  //   return await this.listProjects.execute(office_id, {
  //     client_id,
  //     project_type_id,
  //     name,
  //   });
  // }
}
