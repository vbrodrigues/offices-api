import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
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
    request: CreateProjectStepDTO,
  ): Promise<ProjectStep> {
    const project = await this.projectsRepository.findById(request.project_id);

    if (!project) {
      throw new UnauthorizedException();
    }

    if (office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    return await this.projectStepsRepository.add(request);
  }
}
