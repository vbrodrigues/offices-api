import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { ProjectStep } from '@prisma/client';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { CreateProjectStepDTO } from '../dtos/create-project-step.dto';
import { ProjectStepsRepository } from '../project-step.repository';

@Injectable()
export class CreateProjectStepUsecase {
  constructor(
    private projectStepsRepository: ProjectStepsRepository,
    private projectsRepository: ProjectsRepository,
  ) {}

  async execute(
    office_id: string,
    last_updated_by: string,
    project_id: string,
    step_id: string,
    request: CreateProjectStepDTO,
  ): Promise<ProjectStep> {
    const project = await this.projectsRepository.findById(project_id);

    if (!project) {
      throw new UnauthorizedException();
    }

    if (office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    const projectStep = await this.projectStepsRepository.findByProjectAndStep(
      project_id,
      step_id,
    );
    if (projectStep) {
      throw new BadRequestException('Step already added to project');
    }

    // New steps go to the end of the project
    const projectSteps = await this.projectStepsRepository.findByProject(
      project_id,
    );
    const position =
      projectSteps.length > 0
        ? Math.max(...projectSteps.map((step) => step.position)) + 1
        : 0;

    return await this.projectStepsRepository.add({
      ...request,
      project_id,
      step_id,
      status: 'not-started',
      last_updated_by,
      last_updated_at: new Date(),
      position,
    });
  }
}
