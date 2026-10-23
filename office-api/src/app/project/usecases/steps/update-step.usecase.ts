import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectsRepository } from '../../project.repository';
import { EmployeesRepository } from 'src/app/employee/employee.repository';
import { UpdateProjectStepUsecase } from 'src/app/project-step/usecases/update-project-step.usecase';
import { StepsRepository } from 'src/app/step/step.repository';
import { UpdateProjectStepDTO } from 'src/app/project-step/dtos/update-project-step.dto';
import { ProjectStepsRepository } from 'src/app/project-step/project-step.repository';

@Injectable()
export class UpdateStepUsecase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private stepsRepository: StepsRepository,
    private projectStepsRepository: ProjectStepsRepository,
    private updateProjectStep: UpdateProjectStepUsecase,
    private employeesRepository: EmployeesRepository,
  ) {}

  async execute(
    office_id: string,
    project_id: string,
    step_id: string,
    employee_id: string,
    data: UpdateProjectStepDTO,
  ) {
    const project = await this.projectsRepository.findById(project_id);

    if (!project) {
      throw new UnauthorizedException();
    }

    if (office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    const step = await this.stepsRepository.findById(step_id);

    if (!step) {
      throw new UnauthorizedException();
    }

    const projectStep = await this.projectStepsRepository.findByProjectAndStep(
      project_id,
      step_id,
    );

    if (!projectStep) {
      throw new UnauthorizedException();
    }

    // The responsible must be an active employee of the office; null unassigns
    if (data.assigned_to) {
      const assigned = await this.employeesRepository.findById(
        data.assigned_to,
      );

      if (!assigned || assigned.office_id !== office_id || !assigned.is_active) {
        throw new BadRequestException('Invalid responsible employee.');
      }
    }

    // The global ValidationPipe doesn't whitelist, so pass only known fields
    const { status, step_hours, assigned_to, start_date, end_date } = data;

    await this.updateProjectStep.execute(projectStep.id, employee_id, {
      status,
      step_hours,
      assigned_to,
      start_date,
      end_date,
    });
  }
}
