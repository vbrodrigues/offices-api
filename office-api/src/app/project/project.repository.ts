import { Injectable } from '@nestjs/common';
import { Client, Project, ProjectFile, ProjectStep } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import {
  CreateProjectDTO,
  CreateProjectInternalDTO,
} from './dtos/create-project.dto';
import { ProjectFilters } from './dtos/find-project-filters.dto';
import { UpdateProjectDTO } from './dtos/update-project.dto';

export type FullProject = Project & {
  files: ProjectFile[];
  client: Client;
  project_steps: ProjectStep[];
};

export abstract class ProjectsRepository {
  abstract findBy(
    office_id: string,
    projectFilters: ProjectFilters,
  ): Promise<FullProject[]>;
  abstract findById(project_id: string): Promise<FullProject | null>;
  abstract add(data: CreateProjectDTO): Promise<Project>;
  abstract update(project_id: string, data: UpdateProjectDTO): Promise<void>;
}

@Injectable()
export class ProjectsRepositorySQL implements ProjectsRepository {
  constructor(private prisma: PrismaService) {}

  async findBy(
    office_id: string,
    projectFilters: ProjectFilters,
  ): Promise<FullProject[]> {
    return await this.prisma.project.findMany({
      where: { client: { office: { id: office_id } }, ...projectFilters },
      include: {
        files: true,
        client: true,
        project_steps: { include: { step: true } },
      },
    });
  }

  async findById(project_id: string): Promise<FullProject | null> {
    return await this.prisma.project.findUnique({
      where: { id: project_id },
      include: { files: true, client: true, project_steps: true },
    });
  }

  async add(data: CreateProjectInternalDTO): Promise<Project> {
    return await this.prisma.project.create({ data: data });
  }

  async update(project_id: string, data: UpdateProjectDTO): Promise<void> {
    const raw = { ...data, updated_at: new Date() };
    await this.prisma.project.update({ where: { id: project_id }, data: raw });
  }
}
