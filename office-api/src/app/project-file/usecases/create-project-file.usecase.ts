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
import { CategoriesRepository } from 'src/app/category/category.repository';
import { projectFileKey } from 'src/app/common/utils/storage-keys';

@Injectable()
export class CreateProjectFileUsecase {
  constructor(
    private projectFilesRepository: ProjectFilesRepository,
    private projectsRepository: ProjectsRepository,
    private employeesRepository: EmployeesRepository,
    private categoriesRepository: CategoriesRepository,
    private storageSerivce: StorageService,
    private notificationsService: NotificationsService,
  ) {}

  async execute(
    office_id: string,
    employee_id: string,
    request: CreateProjectFileDTO,
  ): Promise<ProjectFile> {
    const project = await this.projectsRepository.findById(request.project_id);

    if (!project) {
      throw new UnauthorizedException();
    }

    if (office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    const employee = await this.employeesRepository.findById(employee_id);

    if (!employee || office_id !== employee.office_id) {
      throw new UnauthorizedException();
    }

    if (request.category_id) {
      const category = await this.categoriesRepository.findById(
        request.category_id,
      );

      if (!category || category.office_id !== office_id) {
        throw new UnauthorizedException();
      }
    }

    if (
      request.project_step_id &&
      !project.project_steps.some((step) => step.id === request.project_step_id)
    ) {
      throw new BadRequestException('Step does not belong to the project.');
    }

    // This endpoint uploads to the root of the project
    const alreadyExists = await this.projectFilesRepository.findByName(
      request.project_id,
      null,
      request.name,
    );

    if (alreadyExists) {
      throw new BadRequestException('Project file already exists.');
    }

    const filePath = projectFileKey(project, uuid(), request.fileFormat);

    // Upload before saving, so a failed upload leaves no file without a path
    const fileKey = await this.storageSerivce.uploadFile(
      decodeBase64(request.file),
      filePath,
    );

    const projectFile = await this.projectFilesRepository.add({
      created_by_id: employee_id,
      path: fileKey,
      project_id: request.project_id,
      name: request.name,
      category_id: request.category_id || null,
      project_step_id: request.project_step_id || null,
    });

    delete projectFile.path;

    const employees = await this.employeesRepository.findByOfficeId(office_id);

    // Fire-and-forget; a failed notification must not crash the process
    employees.forEach((notifiedEmployee) => {
      if (notifiedEmployee.id !== employee_id) {
        this.notificationsService
          .notify({
            content: `Novo arquivo ${request.name} adicionado por ${employee.name} ao projeto ${project.name}`,
            type: 'EMAIL',
            receiver: notifiedEmployee.email,
          })
          .catch((err) => console.log('Error notifying employee:', err));
      }
    });

    return projectFile;
  }
}
