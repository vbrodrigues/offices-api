import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StepsRepository } from '../step.repository';

@Injectable()
export class RemoveStepUsecase {
  constructor(private stepsRepository: StepsRepository) {}

  async execute(office_id: string, step_id: string): Promise<void> {
    const step = await this.stepsRepository.findById(step_id);

    if (!step) {
      throw new UnauthorizedException();
    }

    if (office_id !== step.office_id) {
      throw new UnauthorizedException();
    }

    await this.stepsRepository.delete(step_id);
  }
}
