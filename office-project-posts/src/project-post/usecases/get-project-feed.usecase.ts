import { Injectable } from '@nestjs/common';
import { PaginationParams } from 'src/app/common/dtos/pagination';
import { ProjectPost } from 'src/database/nosql/models';
import { ProjectPostsRepository } from '../project-post.repository';

@Injectable()
export class GetProjectFeedUsecase {
  constructor(private projectPostsRepository: ProjectPostsRepository) {}

  async execute(
    project_id: string,
    paginationParams: PaginationParams,
  ): Promise<ProjectPost[]> {
    return await this.projectPostsRepository.list(project_id, paginationParams);
  }
}
