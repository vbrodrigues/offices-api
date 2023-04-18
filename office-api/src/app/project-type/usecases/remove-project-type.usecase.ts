import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectTypesRepository } from '../project-type.repository';

@Injectable()
export class RemoveProjectTypeUsecase {
  constructor(private projectTypesRepository: ProjectTypesRepository) {}

  async execute(office_id: string, project_type_id: string): Promise<void> {
    const projectType = await this.projectTypesRepository.findById(
      project_type_id,
    );

    if (!projectType) {
      throw new UnauthorizedException();
    }

    if (office_id !== projectType.office_id) {
      throw new UnauthorizedException();
    }

    await this.projectTypesRepository.delete(project_type_id);
  }
}
