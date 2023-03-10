import { Body, Controller, Post } from '@nestjs/common';
import { ProjectType } from '@prisma/client';
import { CreateProjectTypeDTO } from './dtos/create-project-type.dto';
import { CreateProjectTypeUsecase } from './usecases/create-project-type.usecase';

@Controller('/project-types')
export class ProjectTypeController {
  constructor(private createProjectType: CreateProjectTypeUsecase) {}

  @Post()
  async create(@Body() data: CreateProjectTypeDTO): Promise<ProjectType> {
    return await this.createProjectType.execute(data);
  }
}
