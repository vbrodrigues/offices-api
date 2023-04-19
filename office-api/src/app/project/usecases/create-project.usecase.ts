import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Project } from '@prisma/client';
import { ClientsRepository } from 'src/app/client/client.repository';
import { EmployeesRepository } from 'src/app/employee/employee.repository';
import { CreateProjectStepUsecase } from 'src/app/project-step/usecases/create-project-step.usecase';
import { NotificationsService } from 'src/events/notifications/notifications.service';
import { CreateProjectDTO } from '../dtos/create-project.dto';
import { ProjectsRepository } from '../project.repository';
import { StepsRepository } from 'src/app/step/step.repository';

@Injectable()
export class CreateProjectUsecase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private clientsRepository: ClientsRepository,
    private employeesRepository: EmployeesRepository,
    private stepsRepository: StepsRepository,
    private createProjectStep: CreateProjectStepUsecase,
    private notificationsService: NotificationsService,
  ) {}

  async execute(
    office_id: string,
    employee_id: string,
    request: CreateProjectDTO,
  ): Promise<Project> {
    const client = await this.clientsRepository.findById(request.client_id);

    if (!client || office_id !== client.office_id) {
      throw new UnauthorizedException();
    }

    const employee = await this.employeesRepository.findById(employee_id);

    if (!employee) {
      throw new UnauthorizedException();
    }

    if (employee.office_id !== office_id) {
      throw new UnauthorizedException();
    }

    const alreadyExists = await this.projectsRepository.findBy(office_id, {
      client_id: request.client_id,
      name: request.name,
    });

    if (alreadyExists.length > 0) {
      throw new BadRequestException('Project already exists.');
    }

    const project = await this.projectsRepository.add({
      client_id: request.client_id,
      name: request.name,
    });

    request.steps.forEach(async (stepName) => {
      const step = await this.stepsRepository.findByName(stepName);

      if (!step) {
        return;
      }

      await this.createProjectStep.execute(office_id, {
        project_id: project.id,
        project_step_id: step.id,
        status: 'PENDING',
      });
    });

    const employees = await this.employeesRepository.findByOfficeId(office_id);

    employees.forEach(async (notifiedEmployee) => {
      if (notifiedEmployee.id !== employee_id) {
        await this.notificationsService.notify({
          content: `Um novo projeto foi criado para o cliente ${client.name}! `,
          type: 'EMAIL',
          receiver: notifiedEmployee.email,
        });
      }
    });

    return project;
  }
}
