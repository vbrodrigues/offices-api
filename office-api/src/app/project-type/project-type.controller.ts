import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import {
  Param,
  Request,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { ProjectType } from '@prisma/client';
import { CreateProjectTypeDTO } from './dtos/create-project-type.dto';
import { CreateProjectTypeUsecase } from './usecases/create-project-type.usecase';
import { ListProjectTypesUsecase } from './usecases/list-project-types.usecase';
import { JwtAuthGuard } from 'src/auth/employee/jwt-auth.guard';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { RemoveProjectTypeUsecase } from './usecases/remove-project-type.usecase';
import { BaseResponse } from '../common/dtos/responses';

@Controller('/project-types')
export class ProjectTypeController {
  constructor(
    private createProjectType: CreateProjectTypeUsecase,
    private listProjectTypes: ListProjectTypesUsecase,
    private removeProjectType: RemoveProjectTypeUsecase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() { user: { office_id } }: OfficeRequest,
    @Body() data: CreateProjectTypeDTO,
  ): Promise<ProjectType> {
    return await this.createProjectType.execute(data, office_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async show(
    @Request() { user: { office_id } }: OfficeRequest,
  ): Promise<ProjectType[]> {
    return await this.listProjectTypes.execute(office_id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:project_type_id')
  async remove(
    @Request() { user: { office_id } }: OfficeRequest,
    @Param('project_type_id') project_type_id: string,
  ): Promise<BaseResponse> {
    await this.removeProjectType.execute(office_id, project_type_id);
    return { success: true, message: 'Project type deleted successfully.' };
  }
}
