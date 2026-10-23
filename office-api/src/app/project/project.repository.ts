import { Injectable } from '@nestjs/common';
import { Client, Project, ProjectFile, ProjectStep } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import {
  CreateProjectDTO,
  CreateProjectInternalDTO,
} from './dtos/create-project.dto';
import { ProjectFilters } from './dtos/find-project-filters.dto';
import { UpdateProjectDTO } from './dtos/update-project.dto';

// Employee data that is safe to send to the browser (never the password)
const employeePublicFields = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  office_id: true,
  role_id: true,
};

const clientPublicFields = {
  id: true,
  office_id: true,
  name: true,
  email: true,
  phone_number: true,
  logo: true,
  is_active: true,
  created_at: true,
  updated_at: true,
};

export type FullProject = Project & {
  files: ProjectFile[];
  client: Omit<Client, 'password'>;
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
        files: {
          include: {
            category: true,
            created_by: { select: { ...employeePublicFields, role: true } },
          },
        },
        client: { select: clientPublicFields },
        project_steps: {
          include: {
            step: true,
            assigned: { select: employeePublicFields },
          },
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  async findById(project_id: string): Promise<FullProject | null> {
    return await this.prisma.project.findUnique({
      where: { id: project_id },
      include: {
        files: {
          include: {
            category: true,
            created_by: { select: { ...employeePublicFields, role: true } },
          },
        },
        client: { select: clientPublicFields },
        project_steps: {
          include: {
            step: true,
            assigned: { select: employeePublicFields },
          },
          orderBy: { position: 'asc' },
        },
      },
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
