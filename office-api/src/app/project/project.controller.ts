import {
  Body,
  Controller,
  Get,
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
import { UpdateProjectStatusUsecase } from './usecases/update-project-status.usecase';
import { ProjectStatus } from './dtos/update-project.dto';
import { FindProjectUsecase } from './usecases/find-project.usecase';
import { FullProject } from './project.repository';
import { JwtAuthGuard } from 'src/auth/employee/jwt-auth.guard';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { ClientJwtAuthGuard } from 'src/auth/client/client-jwt-auth.guard';

@Controller('/projects')
export class ProjectController {
  constructor(
    private createProject: CreateProjectUsecase,
    private listProjects: ListProjectsUsecase,
    private renameProject: RenameProjectUsecase,
    private updateProjectStatus: UpdateProjectStatusUsecase,
    private findProject: FindProjectUsecase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() { user: { office_id } }: OfficeRequest,
    @Body() request: CreateProjectDTO,
  ): Promise<Project> {
    return await this.createProject.execute(office_id, request);
  }

  @UseGuards(JwtAuthGuard, ClientJwtAuthGuard)
  @Get()
  async show(
    @Request() { user: { office_id } }: OfficeRequest,
    @Query('client_id') client_id: string,
    @Query('project_type_id') project_type_id: string,
    @Query('name') name: string,
  ): Promise<FullProject[]> {
    return await this.listProjects.execute(office_id, {
      client_id,
      project_type_id,
      name,
    });
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
  @Put('/:project_id/status')
  async updateStatus(
    @Request()
    { user: { office_id } }: OfficeRequest,
    @Param('project_id') project_id: string,
    @Body() data: { status: ProjectStatus },
  ): Promise<BaseResponse> {
    await this.updateProjectStatus.execute(office_id, project_id, data.status);
    return { success: true, message: 'Project status updated successfully.' };
  }

  @UseGuards(JwtAuthGuard, ClientJwtAuthGuard)
  @Get('/:project_id')
  async index(
    @Request() { user: { office_id } }: OfficeRequest,
    @Param('project_id') project_id: string,
  ): Promise<FullProject | null> {
    return await this.findProject.execute(office_id, project_id);
  }
}
