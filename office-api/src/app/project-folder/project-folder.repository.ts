import { Injectable } from '@nestjs/common';
import { ProjectFolder } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import {
  CreateProjectFolderInternalDTO,
  UpdateProjectFolderInternalDTO,
} from './dtos/project-folder.dto';

export abstract class ProjectFoldersRepository {
  abstract findById(project_folder_id: string): Promise<ProjectFolder | null>;
  // Every folder of the project, as a flat list; callers build the tree
  abstract listByProject(project_id: string): Promise<ProjectFolder[]>;
  abstract add(data: CreateProjectFolderInternalDTO): Promise<ProjectFolder>;
  abstract update(
    project_folder_id: string,
    data: UpdateProjectFolderInternalDTO,
  ): Promise<void>;
  // Deletes the folders, their files' rows and, through the cascade, every
  // subfolder. Storage objects must be deleted by the caller.
  abstract deleteWithFiles(
    folder_ids: string[],
    file_ids: string[],
  ): Promise<void>;
}

@Injectable()
export class ProjectFoldersRepositorySQL implements ProjectFoldersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(project_folder_id: string): Promise<ProjectFolder | null> {
    return await this.prisma.projectFolder.findUnique({
      where: { id: project_folder_id },
    });
  }

  async listByProject(project_id: string): Promise<ProjectFolder[]> {
    return await this.prisma.projectFolder.findMany({
      where: { project_id },
      orderBy: [{ position: 'asc' }, { name: 'asc' }],
    });
  }

  async add(data: CreateProjectFolderInternalDTO): Promise<ProjectFolder> {
    return await this.prisma.projectFolder.create({ data });
  }

  async update(
    project_folder_id: string,
    data: UpdateProjectFolderInternalDTO,
  ): Promise<void> {
    await this.prisma.projectFolder.update({
      where: { id: project_folder_id },
      data: { ...data, updated_at: new Date() },
    });
  }

  async deleteWithFiles(
    folder_ids: string[],
    file_ids: string[],
  ): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.projectFile.deleteMany({ where: { id: { in: file_ids } } }),
      this.prisma.projectFolder.deleteMany({
        where: { id: { in: folder_ids } },
      }),
    ]);
  }
}
