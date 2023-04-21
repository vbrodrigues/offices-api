import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectsRepository } from '../../project.repository';
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

    await this.updateProjectStep.execute(projectStep.id, employee_id, data);
  }
}
