import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Project } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from '@nestjs/common/decorators/http/route-params.decorator';
import { CreateProjectDTO } from './dtos/create-project.dto';
import { CreateProjectUsecase } from './usecases/create-project.usecase';
import { ListProjectsUsecase } from './usecases/list-projects.usecase';
import { OfficeRequest } from 'src/auth/auth.dtos';

@Controller('/projects')
export class ProjectController {
  constructor(
    private createProject: CreateProjectUsecase,
    private listProjects: ListProjectsUsecase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() { user: { office_id } }: OfficeRequest,
    @Body() request: CreateProjectDTO,
  ): Promise<Project> {
    return await this.createProject.execute(office_id, request);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async show(
    @Request() { user: { office_id } }: OfficeRequest,
    @Query('client_id') client_id: string,
    @Query('project_type_id') project_type_id: string,
    @Query('name') name: string,
  ): Promise<Project[]> {
    return await this.listProjects.execute(office_id, {
      client_id,
      project_type_id,
      name,
    });
  }
}
