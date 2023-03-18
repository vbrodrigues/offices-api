import { Injectable } from '@nestjs/common';
import { ProjectSchedule } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import { CreateProjectScheduleDTO } from './dtos/create-project-schedule.dto';

export abstract class ProjectSchedulesRepository {
  abstract add(data: CreateProjectScheduleDTO): Promise<ProjectSchedule>;
}

@Injectable()
export class ProjectSchedulesRepositorySQL
  implements ProjectSchedulesRepository
{
  constructor(private prisma: PrismaService) {}

  async add(data: CreateProjectScheduleDTO): Promise<ProjectSchedule> {
    return await this.prisma.projectSchedule.create({ data: data });
  }
}
