import { Injectable } from '@nestjs/common';
import { ProjectFile, ProjectFolder } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import { CreateProjectFileInternalDTO } from './dtos/create-project-file.dto';
import { UpdateProjectFileDTO } from './dtos/update-project-file.dto';
import { CreateProjectFolderInternalDTO } from '../project-folder/dtos/project-folder.dto';

export interface ProjectFileMove {
  id: string;
  folder_id: string | null;
  // Changes when the name was taken in the destination folder
  name: string;
}

@Injectable()
export abstract class ProjectFilesRepository {
  abstract findById(project_file_id: string): Promise<ProjectFile | null>;
  abstract findByPaths(paths: string[]): Promise<ProjectFile[]>;
  // Creates the folders, then the files, all or nothing. Both need their ids.
  abstract addBatch(
    folders: (CreateProjectFolderInternalDTO & { id: string })[],
    files: (CreateProjectFileInternalDTO & { id: string })[],
  ): Promise<{ folders: ProjectFolder[]; files: ProjectFile[] }>;
  abstract moveMany(moves: ProjectFileMove[]): Promise<void>;
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

  async findByPaths(paths: string[]): Promise<ProjectFile[]> {
    return await this.prisma.projectFile.findMany({
      where: { path: { in: paths } },
    });
  }

  async addBatch(
    folders: (CreateProjectFolderInternalDTO & { id: string })[],
    files: (CreateProjectFileInternalDTO & { id: string })[],
  ): Promise<{ folders: ProjectFolder[]; files: ProjectFile[] }> {
    const folderIds = folders.map((folder) => folder.id);
    const fileIds = files.map((file) => file.id);

    const [, , createdFolders, createdFiles] = await this.prisma.$transaction([
      this.prisma.projectFolder.createMany({ data: folders }),
      this.prisma.projectFile.createMany({ data: files }),
      this.prisma.projectFolder.findMany({ where: { id: { in: folderIds } } }),
      this.prisma.projectFile.findMany({ where: { id: { in: fileIds } } }),
    ]);

    return { folders: createdFolders, files: createdFiles };
  }

  async moveMany(moves: ProjectFileMove[]): Promise<void> {
    const updated_at = new Date();

    await this.prisma.$transaction(
      moves.map((move) =>
        this.prisma.projectFile.update({
          where: { id: move.id },
          data: { folder_id: move.folder_id, name: move.name, updated_at },
        }),
      ),
    );
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
