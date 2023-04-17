import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Request } from '@nestjs/common/decorators/http/route-params.decorator';
import { ProjectType } from '@prisma/client';
import { CreateProjectTypeDTO } from './dtos/create-project-type.dto';
import { CreateProjectTypeUsecase } from './usecases/create-project-type.usecase';
import { ListProjectTypesUsecase } from './usecases/list-project-types.usecase';
import { JwtAuthGuard } from 'src/auth/employee/jwt-auth.guard';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';

@Controller('/project-types')
export class ProjectTypeController {
  constructor(
    private createProjectType: CreateProjectTypeUsecase,
    private listProjectTypes: ListProjectTypesUsecase,
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
}
