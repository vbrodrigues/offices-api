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
import { RemoveProjectFileUsecase } from './usecases/remove-project-file.usecase';
import { EditProjectFileUsecase } from './usecases/edit-project-file.usecase';
import { EditProjectFileDTO } from './dtos/update-project-file.dto';
import { BaseResponse } from '../common/dtos/responses';
import { JwtAuthGuard } from 'src/auth/employee/jwt-auth.guard';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { invalidateProjectsCache } from '../common/utils/projects-cache';
import {
  CreateProjectFilesBatchDTO,
  MoveProjectFilesDTO,
  ProjectFileUpload,
  RequestProjectFileUploadsDTO,
} from './dtos/batch-project-files.dto';
import { RequestProjectFileUploadsUsecase } from './usecases/request-project-file-uploads.usecase';
import { CreateProjectFilesBatchUsecase } from './usecases/create-project-files-batch.usecase';
import { MoveProjectFilesUsecase } from './usecases/move-project-files.usecase';

@Controller('/project-files')
export class ProjectFileController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private removeProjectFile: RemoveProjectFileUsecase,
    private editProjectFile: EditProjectFileUsecase,
    private requestProjectFileUploads: RequestProjectFileUploadsUsecase,
    private createProjectFilesBatch: CreateProjectFilesBatchUsecase,
    private moveProjectFiles: MoveProjectFilesUsecase,
  ) {}

  // Batch upload, step 1: presigned URLs the browser PUTs each file to
  @UseGuards(JwtAuthGuard)
  @Post('/uploads')
  async requestUploads(
    @Request() { user: { office_id } }: OfficeRequest,
    @Body() request: RequestProjectFileUploadsDTO,
  ): Promise<ProjectFileUpload[]> {
    return await this.requestProjectFileUploads.execute(office_id, request);
  }

  // Batch upload, step 2: saves the uploaded files
  @UseGuards(JwtAuthGuard)
  @Post('/batch')
  async createBatch(
    @Request() { user: { office_id, employee_id } }: OfficeRequest,
    @Body() request: CreateProjectFilesBatchDTO,
  ): Promise<ProjectFile[]> {
    const files = await this.createProjectFilesBatch.execute(
      office_id,
      employee_id,
      request,
    );
    await invalidateProjectsCache(
      this.cacheManager,
      office_id,
      request.project_id,
    );
    return files;
  }

  // Declared before /:project_file_id so "move" isn't read as a file id
  @UseGuards(JwtAuthGuard)
  @Put('/move')
  async move(
    @Request() { user: { office_id } }: OfficeRequest,
    @Body() request: MoveProjectFilesDTO,
  ): Promise<BaseResponse> {
    const project_id = await this.moveProjectFiles.execute(office_id, request);
    await invalidateProjectsCache(this.cacheManager, office_id, project_id);
    return { success: true, message: 'Project files moved successfully.' };
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
    @Request() { user }: OfficeRequest,
    @Param('project_file_id') project_file_id: string,
  ): Promise<BaseResponse> {
    const project_id = await this.removeProjectFile.execute(
      user,
      project_file_id,
    );
    await invalidateProjectsCache(
      this.cacheManager,
      user.office_id,
      project_id,
    );
    return { success: true, message: 'Project file deleted successfully.' };
  }
}
