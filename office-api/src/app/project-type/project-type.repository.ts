import { Injectable } from '@nestjs/common';
import { ProjectType } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import { CreateProjectTypeDTO } from './dtos/create-project-type.dto';

export abstract class ProjectTypesRepository {
  abstract findByName(
    name: string,
    office_id: string,
  ): Promise<ProjectType | null>;
  abstract findById(project_type_id: string): Promise<ProjectType | null>;
  abstract add(data: CreateProjectTypeDTO): Promise<ProjectType>;
  abstract list(office_id: string): Promise<ProjectType[]>;
  abstract delete(project_type_id: string): Promise<void>;
}

@Injectable()
export class ProjectTypesRepositorySQL implements ProjectTypesRepository {
  constructor(private prisma: PrismaService) {}

  async findByName(name: string, office_id: string): Promise<ProjectType> {
    return await this.prisma.projectType.findFirst({
      where: { name, office_id },
    });
  }

  async findById(project_type_id: string): Promise<ProjectType> {
    return await this.prisma.projectType.findUnique({
      where: { id: project_type_id },
    });
  }

  async add(data: CreateProjectTypeDTO): Promise<ProjectType> {
    return await this.prisma.projectType.create({ data });
  }

  async list(office_id: string): Promise<ProjectType[]> {
    return await this.prisma.projectType.findMany({ where: { office_id } });
  }

  async delete(project_type_id: string): Promise<void> {
    await this.prisma.projectType.delete({ where: { id: project_type_id } });
  }
}
