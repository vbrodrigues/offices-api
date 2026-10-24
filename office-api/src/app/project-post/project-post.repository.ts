import { Injectable } from '@nestjs/common';
import { Employee, ProjectPost } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import { CreateProjectPostInternalDTO } from './dtos/project-post.dto';

export type ProjectPostWithLikes = ProjectPost & {
  employee: Pick<Employee, 'id' | 'name'>;
  _count: { likes: number };
  // Only the reading client's like, if any
  likes: { id: string }[];
};

export abstract class ProjectPostsRepository {
  abstract add(data: CreateProjectPostInternalDTO): Promise<ProjectPost>;
  abstract findById(project_post_id: string): Promise<ProjectPost | null>;
  abstract listByProject(
    project_id: string,
    client_id: string,
    params: { ordering: 'asc' | 'desc'; offset: number; limit: number },
  ): Promise<ProjectPostWithLikes[]>;
  // Both are idempotent: liking twice keeps one like
  abstract like(project_post_id: string, client_id: string): Promise<void>;
  abstract unlike(project_post_id: string, client_id: string): Promise<void>;
}

@Injectable()
export class ProjectPostsRepositorySQL implements ProjectPostsRepository {
  constructor(private prisma: PrismaService) {}

  async add(data: CreateProjectPostInternalDTO): Promise<ProjectPost> {
    return await this.prisma.projectPost.create({ data });
  }

  async findById(project_post_id: string): Promise<ProjectPost | null> {
    return await this.prisma.projectPost.findUnique({
      where: { id: project_post_id },
    });
  }

  async listByProject(
    project_id: string,
    client_id: string,
    {
      ordering,
      offset,
      limit,
    }: { ordering: 'asc' | 'desc'; offset: number; limit: number },
  ): Promise<ProjectPostWithLikes[]> {
    return await this.prisma.projectPost.findMany({
      where: { project_id },
      orderBy: { created_at: ordering },
      skip: offset,
      take: limit,
      include: {
        employee: { select: { id: true, name: true } },
        _count: { select: { likes: true } },
        likes: { where: { client_id }, select: { id: true } },
      },
    });
  }

  async like(project_post_id: string, client_id: string): Promise<void> {
    await this.prisma.projectPostLike.upsert({
      where: { project_post_id_client_id: { project_post_id, client_id } },
      create: { project_post_id, client_id },
      update: {},
    });
  }

  async unlike(project_post_id: string, client_id: string): Promise<void> {
    await this.prisma.projectPostLike.deleteMany({
      where: { project_post_id, client_id },
    });
  }
}
