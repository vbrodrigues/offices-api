import { Injectable } from '@nestjs/common';
import { ProjectType } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import { CreateProjectTypeDTO } from './dtos/create-project-type.dto';

export abstract class ProjectTypesRepository {
  abstract findByName(name: string): Promise<ProjectType | null>;
  abstract add(data: CreateProjectTypeDTO): Promise<ProjectType>;
}

@Injectable()
export class ProjectTypesRepositorySQL implements ProjectTypesRepository {
  constructor(private prisma: PrismaService) {}

  async findByName(name: string): Promise<ProjectType> {
    return await this.prisma.projectType.findFirst({ where: { name } });
  }

  async add(data: CreateProjectTypeDTO): Promise<ProjectType> {
    return await this.prisma.projectType.create({ data });
  }
}
