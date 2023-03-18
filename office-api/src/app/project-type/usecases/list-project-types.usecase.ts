import { Injectable } from '@nestjs/common';
import { ProjectType } from '@prisma/client';
import { ProjectTypesRepository } from '../project-type.repository';

@Injectable()
export class ListProjectTypesUsecase {
  constructor(private projectTypesRepository: ProjectTypesRepository) {}

  async execute(): Promise<ProjectType[]> {
    return await this.projectTypesRepository.list();
  }
}
