import { Injectable } from '@nestjs/common';
import { StepsRepository } from '../step.repository';
import { Step } from '@prisma/client';

@Injectable()
export class ListStepsUsecase {
  constructor(private stepsRepository: StepsRepository) {}

  async execute(office_id: string): Promise<Step[]> {
    return await this.stepsRepository.listSteps(office_id);
  }
}
