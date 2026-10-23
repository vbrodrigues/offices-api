import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectsRepository } from '../../project.repository';
import { ProjectStepsRepository } from 'src/app/project-step/project-step.repository';

@Injectable()
export class RemoveStepFromProjectUsecase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private projectStepsRepository: ProjectStepsRepository,
  ) {}

  async execute(
    office_id: string,
    project_id: string,
    step_id: string,
  ): Promise<void> {
    const project = await this.projectsRepository.findById(project_id);

    if (!project || office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    const projectStep = await this.projectStepsRepository.findByProjectAndStep(
      project_id,
      step_id,
    );

    if (!projectStep) {
      throw new UnauthorizedException();
    }

    await this.projectStepsRepository.delete(projectStep.id);

    // Close the gap left by the removed step
    const remainingSteps = await this.projectStepsRepository.findByProject(
      project_id,
    );

    if (remainingSteps.length > 0) {
      await this.projectStepsRepository.updatePositions(
        project_id,
        remainingSteps.map((step) => step.step_id),
      );
    }
  }
}
