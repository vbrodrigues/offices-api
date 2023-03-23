import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { PaginationParams } from 'src/app/common/dtos/pagination';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { ProjectPost } from 'src/database/nosql/models';
import { ProjectPostsRepository } from '../project-post.repository';

@Injectable()
export class GetProjectFeedUsecase {
  constructor(
    private projectPostsRepository: ProjectPostsRepository,
    private projectsRepository: ProjectsRepository,
  ) {}

  async execute(
    office_id: string,
    project_id: string,
    paginationParams: PaginationParams,
  ): Promise<ProjectPost[]> {
    const project = await this.projectsRepository.findById(project_id);

    if (!project) {
      throw new UnauthorizedException();
    }

    if (office_id !== project.client.office_id) {
      throw new UnauthorizedException();
    }

    return await this.projectPostsRepository.list(project_id, paginationParams);
  }
}
