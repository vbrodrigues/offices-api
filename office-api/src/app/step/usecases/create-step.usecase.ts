import { BadRequestException, Injectable } from '@nestjs/common';
import { Step } from '@prisma/client';
import { CreateStepDTO } from '../dtos/create-step.dto';
import { StepsRepository } from '../step.repository';

@Injectable()
export class CreateStepUsecase {
  constructor(private projectStepsRepository: StepsRepository) {}

  async execute(office_id: string, request: CreateStepDTO): Promise<Step> {
    const step = await this.projectStepsRepository.findByName(request.name);

    if (step) {
      throw new BadRequestException('Step already exists');
    }

    return await this.projectStepsRepository.add({ office_id, ...request });
  }
}
