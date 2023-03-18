import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProjectType } from '@prisma/client';
import { CreateProjectTypeDTO } from './dtos/create-project-type.dto';
import { CreateProjectTypeUsecase } from './usecases/create-project-type.usecase';
import { ListProjectTypesUsecase } from './usecases/list-project-types.usecase';

@Controller('/project-types')
export class ProjectTypeController {
  constructor(
    private createProjectType: CreateProjectTypeUsecase,
    private listProjectTypes: ListProjectTypesUsecase,
  ) {}

  @Post()
  async create(@Body() data: CreateProjectTypeDTO): Promise<ProjectType> {
    return await this.createProjectType.execute(data);
  }

  @Get()
  async show(): Promise<ProjectType[]> {
    return await this.listProjectTypes.execute();
  }
}
