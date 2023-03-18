import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Project } from '@prisma/client';
import { ClientsRepository } from 'src/app/client/client.repository';
import { EmployeesRepository } from 'src/app/employee/employee.repository';
import { CreateProjectScheduleUsecase } from 'src/app/project-schedule/usecases/create-project-schedule.usecase';
import { ProjectTypesRepository } from 'src/app/project-type/project-type.repository';
import { CreateProjectDTO } from '../dtos/create-project.dto';
import { ProjectsRepository } from '../project.repository';

@Injectable()
export class CreateProjectUsecase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private clientsRepository: ClientsRepository,
    private projectTypesRepository: ProjectTypesRepository,
    private employeesRepository: EmployeesRepository,
    private createProjectSchedule: CreateProjectScheduleUsecase,
  ) {}

  async execute(
    office_id: string,
    request: CreateProjectDTO,
  ): Promise<Project> {
    const client = await this.clientsRepository.findById(request.client_id);

    if (!client || office_id !== client.office_id) {
      throw new UnauthorizedException();
    }

    const projectType = await this.projectTypesRepository.findById(
      request.project_type_id,
    );

    if (!projectType) {
      throw new BadRequestException('Project type not found.');
    }

    const alreadyExists = await this.projectsRepository.findBy(office_id, {
      client_id: request.client_id,
      name: request.name,
      project_type_id: request.project_type_id,
    });

    if (alreadyExists.length > 0) {
      throw new BadRequestException('Project already exists.');
    }

    if (request.schedule) {
      const employee = await this.employeesRepository.findById(
        request.schedule.assigned_employee_id,
      );

      if (!employee) {
        throw new UnauthorizedException();
      }

      if (employee.office_id !== office_id) {
        throw new UnauthorizedException();
      }
    }

    const project = await this.projectsRepository.add({
      client_id: request.client_id,
      name: request.name,
      project_type_id: request.project_type_id,
    });

    if (request.schedule) {
      await this.createProjectSchedule.execute(office_id, {
        assigned_employee_id: request.schedule.assigned_employee_id,
        start_date: new Date(request.schedule.start_date),
        end_date: new Date(request.schedule.end_date),
        project_id: project.id,
      });
    }

    return project;
  }
}
