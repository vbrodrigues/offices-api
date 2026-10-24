import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { can, Permission } from 'src/auth/employee/permissions';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { EmployeesRepository } from 'src/app/employee/employee.repository';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { NotificationsService } from 'src/providers/notifications/notifications.service';
import { StorageService } from 'src/providers/storage/storage';
import { ProjectFilesRepository } from '../project-file.repository';

@Injectable()
export class RemoveProjectFileUsecase {
  constructor(
    private projectFilesRepository: ProjectFilesRepository,
    private projectsRepository: ProjectsRepository,
    private storageService: StorageService,
    private employeesRepository: EmployeesRepository,
    private notificationsService: NotificationsService,
  ) {}

  // Returns the project the file belonged to
  async execute(
    caller: OfficeRequest['user'],
    project_file_id: string,
  ): Promise<string> {
    const { office_id } = caller;
    const projectFile = await this.projectFilesRepository.findById(
      project_file_id,
    );

    if (!projectFile) {
      throw new UnauthorizedException();
    }

    const project = await this.projectsRepository.findById(
      projectFile.project_id,
    );

    if (!project) {
      throw new UnauthorizedException();
    }

    if (office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    if (
      projectFile.created_by_id !== caller.employee_id &&
      !can(caller.access_level, Permission.DELETE_ANY_FILE)
    ) {
      throw new ForbiddenException('You can only delete your own files.');
    }

    // Older rows can have no path if their upload failed
    if (projectFile.path) {
      const success = await this.storageService.deleteFile(projectFile.path);

      if (!success) {
        throw new InternalServerErrorException(
          'Something went wrong deleting the project file.',
        );
      }
    }

    const employees = await this.employeesRepository.findByOfficeId(office_id);

    // Fire-and-forget; a failed notification must not crash the process
    employees.forEach((notifiedEmployee) => {
      this.notificationsService
        .notify({
          content: `Arquivo ${projectFile.name} removido do projeto ${project.name}`,
          type: 'EMAIL',
          receiver: notifiedEmployee.email,
        })
        .catch((err) => console.log('Error notifying employee:', err));
    });

    await this.projectFilesRepository.delete(project_file_id);

    return projectFile.project_id;
  }
}
