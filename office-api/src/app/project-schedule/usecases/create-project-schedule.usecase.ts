import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { ProjectSchedule } from '@prisma/client';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { CreateProjectScheduleDTO } from '../dtos/create-project-schedule.dto';
import { ProjectSchedulesRepository } from '../project-schedule.repository';

@Injectable()
export class CreateProjectScheduleUsecase {
  constructor(
    private projectSchedulesRepository: ProjectSchedulesRepository,
    private projectsRepository: ProjectsRepository,
  ) {}

  async execute(
    office_id: string,
    request: CreateProjectScheduleDTO,
  ): Promise<ProjectSchedule> {
    const project = await this.projectsRepository.findById(request.project_id);

    if (!project) {
      throw new UnauthorizedException();
    }

    if (office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    return await this.projectSchedulesRepository.add(request);
  }
}
