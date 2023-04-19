import { Injectable } from '@nestjs/common';
import { Step } from '@prisma/client';
import { CreateStepDTO } from '../dtos/create-step.dto';
import { StepsRepository } from '../step.repository';

@Injectable()
export class CreateStepUsecase {
  constructor(private projectStepsRepository: StepsRepository) {}

  async execute(office_id: string, request: CreateStepDTO): Promise<Step> {
    return await this.projectStepsRepository.add({ office_id, ...request });
  }
}
