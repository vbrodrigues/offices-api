import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Project } from '@prisma/client';
import { ClientsRepository } from 'src/app/client/client.repository';
import { ProjectTypesRepository } from 'src/app/project-type/project-type.repository';
import { CreateProjectDTO } from '../dtos/create-project.dto';
import { ProjectsRepository } from '../project.repository';

@Injectable()
export class CreateProjectUsecase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private clientsRepository: ClientsRepository,
    private projectTypesRepository: ProjectTypesRepository,
  ) {}

  async execute(
    office_id: string,
    request: CreateProjectDTO,
  ): Promise<Project> {
    const client = await this.clientsRepository.findById(request.client_id);

    if (!client || office_id !== client.office_id) {
      throw new UnauthorizedException();
    }

    const projectType = await this.projectTypesRepository.findById(
      request.project_type_id,
    );

    if (!projectType) {
      throw new BadRequestException('Project type not found.');
    }

    const alreadyExists = await this.projectsRepository.findBy(office_id, {
      client_id: request.client_id,
      name: request.name,
      project_type_id: request.project_type_id,
    });

    if (alreadyExists.length > 0) {
      throw new BadRequestException('Project already exists.');
    }

    return await this.projectsRepository.add(request);
  }
}
