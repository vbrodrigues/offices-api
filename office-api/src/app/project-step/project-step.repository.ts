import { Injectable } from '@nestjs/common';
import { ProjectStep } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import { CreateProjectStepInternalDTO } from './dtos/create-project-step.dto';
import { UpdateProjectStepInternalDTO } from './dtos/update-project-step.dto';

export abstract class ProjectStepsRepository {
  abstract findById(project_step_id: string): Promise<ProjectStep | null>;
  abstract findByProjectAndStep(
    project_id: string,
    step_id: string,
  ): Promise<ProjectStep | null>;
  abstract findByProject(project_id: string): Promise<ProjectStep[]>;
  abstract add(data: CreateProjectStepInternalDTO): Promise<ProjectStep>;
  abstract delete(project_step_id: string): Promise<void>;
  abstract update(
    project_step_id: string,
    data: UpdateProjectStepInternalDTO,
  ): Promise<void>;
}

@Injectable()
export class ProjectStepsRepositorySQL implements ProjectStepsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(project_step_id: string): Promise<ProjectStep> {
    return await this.prisma.projectStep.findUnique({
      where: { id: project_step_id },
    });
  }

  async findByProjectAndStep(
    project_id: string,
    step_id: string,
  ): Promise<ProjectStep> {
    return await this.prisma.projectStep.findUnique({
      where: { project_id_step_id: { project_id, step_id } },
    });
  }

  async findByProject(project_id: string): Promise<ProjectStep[]> {
    return await this.prisma.projectStep.findMany({
      where: { project_id },
      include: { step: true },
    });
  }

  async add(data: CreateProjectStepInternalDTO): Promise<ProjectStep> {
    return await this.prisma.projectStep.create({ data });
  }

  async delete(project_step_id: string): Promise<void> {
    await this.prisma.projectStep.delete({ where: { id: project_step_id } });
  }

  async update(
    project_step_id: string,
    data: UpdateProjectStepInternalDTO,
  ): Promise<void> {
    await this.prisma.projectStep.update({
      where: { id: project_step_id },
      data,
    });
  }
}
