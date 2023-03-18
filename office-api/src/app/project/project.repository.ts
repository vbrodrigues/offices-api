import { Injectable } from '@nestjs/common';
import { Client, Project } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import { CreateProjectDTO } from './dtos/create-project.dto';
import { ProjectFilters } from './dtos/find-project-filters.dto';

export abstract class ProjectsRepository {
  abstract findBy(
    office_id: string,
    projectFilters: ProjectFilters,
  ): Promise<Project[]>;
  abstract findById(project_id: string): Promise<
    | (Project & {
        client: Client;
      })
    | null
  >;
  abstract add(data: CreateProjectDTO): Promise<Project>;
}

@Injectable()
export class ProjectsRepositorySQL implements ProjectsRepository {
  constructor(private prisma: PrismaService) {}

  async findBy(
    office_id: string,
    projectFilters: ProjectFilters,
  ): Promise<Project[]> {
    return await this.prisma.project.findMany({
      where: { client: { office: { id: office_id } }, ...projectFilters },
      include: { type: true, files: true, client: true },
    });
  }

  async findById(project_id: string): Promise<
    | (Project & {
        client: Client;
      })
    | null
  > {
    return await this.prisma.project.findUnique({
      where: { id: project_id },
      include: { client: true },
    });
  }

  async add(data: CreateProjectDTO): Promise<Project> {
    return await this.prisma.project.create({ data: data });
  }
}
