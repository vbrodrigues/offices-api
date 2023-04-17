import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectType } from '@prisma/client';
import { CreateProjectTypeDTO } from '../dtos/create-project-type.dto';
import { ProjectTypesRepository } from '../project-type.repository';

@Injectable()
export class CreateProjectTypeUsecase {
  constructor(private projectTypesRepository: ProjectTypesRepository) {}

  async execute(
    request: CreateProjectTypeDTO,
    office_id: string,
  ): Promise<ProjectType> {
    if (request.office_id !== office_id) {
      throw new UnauthorizedException();
    }

    const alreadyExists = await this.projectTypesRepository.findByName(
      request.name,
      request.office_id,
    );

    if (alreadyExists) {
      throw new BadRequestException('Project type already exists.');
    }

    return await this.projectTypesRepository.add(request);
  }
}
