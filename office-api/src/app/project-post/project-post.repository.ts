import { Injectable } from '@nestjs/common';
import { ProjectPost } from 'src/database/nosql/models';
import { MongoDBService } from 'src/database/nosql/mongodb.service';
import { PaginationParams } from '../common/dtos/pagination';
import { CreateProjectPostInternalDTO } from './dtos/create-project-posts.dto';

export abstract class ProjectPostsRepository {
  abstract add(data: CreateProjectPostInternalDTO): Promise<ProjectPost>;
  abstract list(
    project_id: string,
    paginationParams: PaginationParams,
  ): Promise<ProjectPost[]>;
}

@Injectable()
export class ProjectPostsRepositoryMongo implements ProjectPostsRepository {
  constructor(private mongo: MongoDBService) {}

  async add(data: CreateProjectPostInternalDTO): Promise<ProjectPost> {
    const post = new this.mongo.projectPost(data);
    return post.save();
  }

  async list(
    project_id: string,
    paginationParams: PaginationParams,
  ): Promise<ProjectPost[]> {
    let ordering: 1 | -1 = -1;
    switch (paginationParams.ordering) {
      case 'ASC' || 'asc' || 'ascending':
        ordering = 1;
      case 'DESC' || 'desc' || 'descending':
        ordering = -1;
    }

    const projectPosts = await this.mongo.projectPost
      .find()
      .where({ project_id: project_id })
      .sort({
        [paginationParams.sortField]: ordering,
      })
      .skip(paginationParams.offset)
      .limit(paginationParams.limit);

    return projectPosts;
  }
}
