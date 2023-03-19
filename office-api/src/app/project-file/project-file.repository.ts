import { Injectable } from '@nestjs/common';
import { ProjectFile } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import { CreateProjectFileInternalDTO } from './dtos/create-project-file.dto';
import { UpdateProjectFileDTO } from './dtos/update-project-file.dto';

@Injectable()
export abstract class ProjectFilesRepository {
  abstract findById(project_file_id: string): Promise<ProjectFile | null>;
  abstract findByName(
    project_id: string,
    name: string,
  ): Promise<ProjectFile | null>;
  abstract add(data: CreateProjectFileInternalDTO): Promise<ProjectFile>;
  abstract update(
    project_file_id: string,
    data: UpdateProjectFileDTO,
  ): Promise<void>;
  abstract delete(project_file_id: string): Promise<void>;
}

@Injectable()
export class ProjectFilesRepositorySQL implements ProjectFilesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(project_file_id: string): Promise<ProjectFile> {
    return await this.prisma.projectFile.findUnique({
      where: { id: project_file_id },
    });
  }

  async findByName(project_id: string, name: string): Promise<ProjectFile> {
    return await this.prisma.projectFile.findFirst({
      where: { project_id, name },
    });
  }

  async add(data: CreateProjectFileInternalDTO): Promise<ProjectFile> {
    return await this.prisma.projectFile.create({ data: data });
  }

  async update(
    project_file_id: string,
    data: UpdateProjectFileDTO,
  ): Promise<void> {
    const raw = { ...data, updated_at: new Date() };
    await this.prisma.projectFile.update({
      where: {
        id: project_file_id,
      },
      data: raw,
    });
  }

  async delete(project_file_id: string): Promise<void> {
    await this.prisma.projectFile.delete({ where: { id: project_file_id } });
  }
}
