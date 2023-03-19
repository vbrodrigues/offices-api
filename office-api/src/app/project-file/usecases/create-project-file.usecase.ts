import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectFile } from '@prisma/client';
import { decodeBase64 } from 'src/app/common/utils/base64';
import { StorageService } from 'src/providers/storage/storage';
import { CreateProjectFileDTO } from '../dtos/create-project-file.dto';
import { ProjectFilesRepository } from '../project-file.repository';
import { v4 as uuid } from 'uuid';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { EmployeesRepository } from 'src/app/employee/employee.repository';

@Injectable()
export class CreateProjectFileUsecase {
  constructor(
    private projectFilesRepository: ProjectFilesRepository,
    private projectsRepository: ProjectsRepository,
    private employeeRepository: EmployeesRepository,
    private storageSerivce: StorageService,
  ) {}

  async execute(
    office_id: string,
    request: CreateProjectFileDTO,
  ): Promise<ProjectFile> {
    const project = await this.projectsRepository.findById(request.project_id);

    if (!project) {
      throw new UnauthorizedException();
    }

    if (office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    const employee = await this.employeeRepository.findById(request.created_by);

    if (!employee) {
      throw new UnauthorizedException();
    }

    if (office_id !== employee.office_id) {
      throw new UnauthorizedException();
    }

    const alreadyExists = await this.projectFilesRepository.findByName(
      request.project_id,
      request.name,
    );

    if (alreadyExists) {
      throw new BadRequestException('Project file already exists.');
    }

    const decodedFile = decodeBase64(request.file);
    const filePath = `projects/${request.project_id}/files/${uuid()}.${
      request.fileFormat
    }`;

    const fileStoragePath = await this.storageSerivce.uploadFile(
      decodedFile,
      filePath,
    );

    const projectFile = await this.projectFilesRepository.add({
      created_by_id: request.created_by,
      path: fileStoragePath,
      project_id: request.project_id,
      name: request.name,
    });

    return projectFile;
  }
}
