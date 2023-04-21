import { CreateProjectStepUsecase } from 'src/app/project-step/usecases/create-project-step.usecase';
import { ProjectsRepository } from '../../project.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectStep } from '@prisma/client';
import { StepsRepository } from 'src/app/step/step.repository';
import { CreateProjectStepDTO } from 'src/app/project-step/dtos/create-project-step.dto';

@Injectable()
export class AddStepToProjectUsecase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private stepsRepository: StepsRepository,
    private createProjectStep: CreateProjectStepUsecase,
  ) {}

  async execute(
    office_id: string,
    employee_id: string,
    project_id: string,
    step_id: string,
    data: CreateProjectStepDTO,
  ): Promise<ProjectStep> {
    const project = await this.projectsRepository.findById(project_id);

    if (!project || office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    const step = await this.stepsRepository.findById(step_id);

    if (!step) {
      throw new UnauthorizedException();
    }

    return await this.createProjectStep.execute(
      office_id,
      employee_id,
      project_id,
      step_id,
      data,
    );
  }
}
