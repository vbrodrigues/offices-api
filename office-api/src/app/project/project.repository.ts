import { Injectable } from '@nestjs/common';
import { Client, Project, ProjectFile, ProjectType } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import { CreateProjectDTO } from './dtos/create-project.dto';
import { ProjectFilters } from './dtos/find-project-filters.dto';
import { UpdateProjectDTO } from './dtos/update-project.dto';

export type FullProject = Project & {
  type: ProjectType;
  files: ProjectFile[];
  client: Client;
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
      include: { type: true, files: true, client: true, schedules: true },
    });
  }

  async findById(project_id: string): Promise<FullProject | null> {
    return await this.prisma.project.findUnique({
      where: { id: project_id },
      include: { type: true, files: true, client: true },
    });
  }

  async add(data: CreateProjectDTO): Promise<Project> {
    return await this.prisma.project.create({ data: data });
  }

  async update(project_id: string, data: UpdateProjectDTO): Promise<void> {
    const raw = { ...data, updated_at: new Date() };
    await this.prisma.project.update({ where: { id: project_id }, data: raw });
  }
}
