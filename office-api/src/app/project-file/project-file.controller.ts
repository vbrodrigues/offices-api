import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Inject,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProjectFile } from '@prisma/client';
import {
  Param,
  Request,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { Cache } from 'cache-manager';
import { CreateProjectFileDTO } from './dtos/create-project-file.dto';
import { CreateProjectFileUsecase } from './usecases/create-project-file.usecase';
import { RemoveProjectFileUsecase } from './usecases/remove-project-file.usecase';
import { EditProjectFileUsecase } from './usecases/edit-project-file.usecase';
import { EditProjectFileDTO } from './dtos/update-project-file.dto';
import { BaseResponse } from '../common/dtos/responses';
import { JwtAuthGuard } from 'src/auth/employee/jwt-auth.guard';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { invalidateProjectsCache } from '../common/utils/projects-cache';

@Controller('/project-files')
export class ProjectFileController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private createProjectFile: CreateProjectFileUsecase,
    private removeProjectFile: RemoveProjectFileUsecase,
    private editProjectFile: EditProjectFileUsecase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() { user: { office_id, employee_id } }: OfficeRequest,
    @Body() request: CreateProjectFileDTO,
  ): Promise<ProjectFile> {
    const projectFile = await this.createProjectFile.execute(
      office_id,
      employee_id,
      request,
    );
    await invalidateProjectsCache(
      this.cacheManager,
      office_id,
      request.project_id,
    );
    return projectFile;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:project_file_id')
  async edit(
    @Request() { user: { office_id } }: OfficeRequest,
    @Param('project_file_id') project_file_id: string,
    @Body() request: EditProjectFileDTO,
  ): Promise<BaseResponse> {
    const project_id = await this.editProjectFile.execute(
      office_id,
      project_file_id,
      request,
    );
    await invalidateProjectsCache(this.cacheManager, office_id, project_id);
    return { success: true, message: 'Project file edited successfully.' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:project_file_id')
  async remove(
    @Request() { user: { office_id } }: OfficeRequest,
    @Param('project_file_id') project_file_id: string,
  ): Promise<BaseResponse> {
    const project_id = await this.removeProjectFile.execute(
      office_id,
      project_file_id,
    );
    await invalidateProjectsCache(this.cacheManager, office_id, project_id);
    return { success: true, message: 'Project file deleted successfully.' };
  }
}
