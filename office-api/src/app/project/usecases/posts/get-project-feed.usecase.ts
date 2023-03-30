import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { PaginationParams } from 'src/app/common/dtos/pagination';
import HTTPClient from 'src/app/common/utils/http-client';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { ProjectPost } from 'src/events/project-posts/project-posts.dto';

@Injectable()
export class GetProjectFeedUsecase {
  constructor(private projectsRepository: ProjectsRepository) {}

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

    try {
      const response = await HTTPClient.get(
        `/project-posts/feed/${project_id}`,
        {
          params: paginationParams,
        },
      );
      return response.data;
    } catch (err) {
      console.log('Error getting project feed. Error:', err);
    }
  }
}
