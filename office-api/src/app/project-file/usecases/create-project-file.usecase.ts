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
import { NotificationsService } from 'src/events/notifications/notifications.service';

@Injectable()
export class CreateProjectFileUsecase {
  constructor(
    private projectFilesRepository: ProjectFilesRepository,
    private projectsRepository: ProjectsRepository,
    private employeesRepository: EmployeesRepository,
    private storageSerivce: StorageService,
    private notificationsService: NotificationsService,
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

    const employee = await this.employeesRepository.findById(
      request.created_by,
    );

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

    const projectFile = await this.projectFilesRepository.add({
      created_by_id: request.created_by,
      path: null,
      project_id: request.project_id,
      name: request.name,
    });

    const decodedFile = decodeBase64(request.file);
    const filePath = `offices/${office_id}/clients/${
      project.client.id
    }/projects/${request.project_id}/files/${uuid()}.${request.fileFormat}`;

    await this.storageSerivce.uploadFile(decodedFile, filePath);

    delete projectFile.path;

    const employees = await this.employeesRepository.findByOfficeId(office_id);

    employees.forEach(async (notifiedEmployee) => {
      if (notifiedEmployee.id !== request.created_by) {
        await this.notificationsService.notify({
          content: `Novo arquivo ${request.name} adicionado por ${employee.name} ao projeto ${project.name}`,
          type: 'EMAIL',
          receiver: notifiedEmployee.email,
        });
      }
    });

    return projectFile;
  }
}
