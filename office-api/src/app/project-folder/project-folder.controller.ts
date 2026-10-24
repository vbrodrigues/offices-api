import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProjectFolder } from '@prisma/client';
import { Cache } from 'cache-manager';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { JwtAuthGuard } from 'src/auth/employee/jwt-auth.guard';
import { BaseResponse } from '../common/dtos/responses';
import { invalidateProjectsCache } from '../common/utils/projects-cache';
import {
  CreateProjectFolderDTO,
  EditProjectFolderDTO,
} from './dtos/project-folder.dto';
import { CreateProjectFolderUsecase } from './usecases/create-project-folder.usecase';
import { EditProjectFolderUsecase } from './usecases/edit-project-folder.usecase';
import { ListProjectFoldersUsecase } from './usecases/list-project-folders.usecase';
import { RemoveProjectFolderUsecase } from './usecases/remove-project-folder.usecase';

@Controller('/project-folders')
export class ProjectFolderController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private createProjectFolder: CreateProjectFolderUsecase,
    private listProjectFolders: ListProjectFoldersUsecase,
    private editProjectFolder: EditProjectFolderUsecase,
    private removeProjectFolder: RemoveProjectFolderUsecase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() { user: { office_id, employee_id } }: OfficeRequest,
    @Body() request: CreateProjectFolderDTO,
  ): Promise<ProjectFolder> {
    return await this.createProjectFolder.execute(
      office_id,
      employee_id,
      request,
    );
  }

  // Flat list of every folder of the project; the client builds the tree
  @UseGuards(JwtAuthGuard)
  @Get('/:project_id')
  async list(
    @Request() { user: { office_id } }: OfficeRequest,
    @Param('project_id') project_id: string,
  ): Promise<ProjectFolder[]> {
    return await this.listProjectFolders.execute(office_id, project_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:project_folder_id')
  async edit(
    @Request() { user: { office_id } }: OfficeRequest,
    @Param('project_folder_id') project_folder_id: string,
    @Body() request: EditProjectFolderDTO,
  ): Promise<BaseResponse> {
    await this.editProjectFolder.execute(office_id, project_folder_id, request);
    return { success: true, message: 'Project folder edited successfully.' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:project_folder_id')
  async remove(
    @Request() { user }: OfficeRequest,
    @Param('project_folder_id') project_folder_id: string,
  ): Promise<BaseResponse> {
    const removed = await this.removeProjectFolder.execute(
      user,
      project_folder_id,
    );
    // Its files leave the project's file list
    await invalidateProjectsCache(
      this.cacheManager,
      user.office_id,
      removed.project_id,
    );
    return {
      success: true,
      message: `Project folder deleted with ${removed.folders} folder(s) and ${removed.files} file(s).`,
    };
  }
}
