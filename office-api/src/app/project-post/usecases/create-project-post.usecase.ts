import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectPost } from 'src/database/nosql/models';
import { CreateProjectPostDTO } from '../dtos/create-project-posts.dto';
import { ProjectPostsRepository } from '../project-post.repository';

@Injectable()
export class CreateProjectPostUsecase {
  constructor(private projectPostsRepository: ProjectPostsRepository) {}

  async execute(
    office_id: string,
    data: CreateProjectPostDTO,
  ): Promise<ProjectPost> {
    if (office_id !== data.office_id) {
      throw new UnauthorizedException();
    }

    return await this.projectPostsRepository.add(data);
  }
}
