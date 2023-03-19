import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProjectFile } from '@prisma/client';
import { Request } from '@nestjs/common/decorators/http/route-params.decorator';
import { OfficeRequest } from 'src/auth/auth.dtos';
import { CreateProjectFileDTO } from './dtos/create-project-file.dto';
import { CreateProjectFileUsecase } from './usecases/create-project-file.usecase';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/project-files')
export class ProjectFileController {
  constructor(private createProjectFile: CreateProjectFileUsecase) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() { user: { office_id } }: OfficeRequest,
    @Body() request: CreateProjectFileDTO,
  ): Promise<ProjectFile> {
    return await this.createProjectFile.execute(office_id, request);
  }
}
