import { Injectable } from '@nestjs/common';
import { ProjectStep } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import { CreateProjectStepDTO } from './dtos/create-project-step.dto';

export abstract class ProjectStepsRepository {
  abstract add(data: CreateProjectStepDTO): Promise<ProjectStep>;
  abstract delete(step_id: string): Promise<void>;
}

@Injectable()
export class ProjectStepsRepositorySQL implements ProjectStepsRepository {
  constructor(private prisma: PrismaService) {}

  async add(data: CreateProjectStepDTO): Promise<ProjectStep> {
    return await this.prisma.projectStep.create({ data });
  }

  async delete(project_step_id: string): Promise<void> {
    await this.prisma.projectStep.delete({ where: { id: project_step_id } });
  }
}
