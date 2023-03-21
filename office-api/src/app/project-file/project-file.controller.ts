import { Body, Controller, Post, Delete, UseGuards } from '@nestjs/common';
import { ProjectFile } from '@prisma/client';
import {
  Param,
  Request,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { CreateProjectFileDTO } from './dtos/create-project-file.dto';
import { CreateProjectFileUsecase } from './usecases/create-project-file.usecase';
import { RemoveProjectFileUsecase } from './usecases/remove-project-file.usecase';
import { BaseResponse } from '../common/dtos/responses';
import { JwtAuthGuard } from 'src/auth/employee/jwt-auth.guard';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';

@Controller('/project-files')
export class ProjectFileController {
  constructor(
    private createProjectFile: CreateProjectFileUsecase,
    private removeProjectFile: RemoveProjectFileUsecase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() { user: { office_id } }: OfficeRequest,
    @Body() request: CreateProjectFileDTO,
  ): Promise<ProjectFile> {
    return await this.createProjectFile.execute(office_id, request);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:project_file_id')
  async remove(
    @Request() { user: { office_id } }: OfficeRequest,
    @Param('project_file_id') project_file_id: string,
  ): Promise<BaseResponse> {
    await this.removeProjectFile.execute(office_id, project_file_id);
    return { success: true, message: 'Project file deleted successfully.' };
  }
}
