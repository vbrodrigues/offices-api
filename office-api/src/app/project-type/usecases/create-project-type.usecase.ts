import { BadRequestException, Injectable } from '@nestjs/common';
import { ProjectType } from '@prisma/client';
import { CreateProjectTypeDTO } from '../dtos/create-project-type.dto';
import { ProjectTypesRepository } from '../project-type.repository';

@Injectable()
export class CreateProjectTypeUsecase {
  constructor(private projectTypesRepository: ProjectTypesRepository) {}

  async execute(request: CreateProjectTypeDTO): Promise<ProjectType> {
    const alreadyExists = await this.projectTypesRepository.findByName(
      request.name,
    );

    if (alreadyExists) {
      throw new BadRequestException('Project type already exists.');
    }

    return await this.projectTypesRepository.add(request);
  }
}
