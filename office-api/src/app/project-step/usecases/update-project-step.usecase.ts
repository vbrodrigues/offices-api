import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectStepsRepository } from '../project-step.repository';
import { UpdateProjectStepDTO } from '../dtos/update-project-step.dto';

@Injectable()
export class UpdateProjectStepUsecase {
  constructor(private projectStepsRepository: ProjectStepsRepository) {}

  async execute(
    project_step_id: string,
    last_updated_by: string,
    data: UpdateProjectStepDTO,
  ): Promise<void> {
    const projectStep = await this.projectStepsRepository.findById(
      project_step_id,
    );

    if (!projectStep) {
      throw new UnauthorizedException();
    }

    await this.projectStepsRepository.update(project_step_id, {
      ...data,
      last_updated_by,
      last_updated_at: new Date(),
    });
  }
}
