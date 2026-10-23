import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectsRepository } from '../../project.repository';
import { ProjectStepsRepository } from 'src/app/project-step/project-step.repository';

@Injectable()
export class ReorderProjectStepsUsecase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private projectStepsRepository: ProjectStepsRepository,
  ) {}

  async execute(
    office_id: string,
    project_id: string,
    step_ids: string[],
  ): Promise<void> {
    const project = await this.projectsRepository.findById(project_id);

    if (!project || office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    // The new order must list exactly the project's steps, each once
    const currentStepIds = project.project_steps.map((step) => step.step_id);
    const isSameSet =
      step_ids.length === currentStepIds.length &&
      new Set(step_ids).size === step_ids.length &&
      step_ids.every((step_id) => currentStepIds.includes(step_id));

    if (!isSameSet) {
      throw new BadRequestException(
        'The new order must contain every step of the project once.',
      );
    }

    await this.projectStepsRepository.updatePositions(project_id, step_ids);
  }
}
