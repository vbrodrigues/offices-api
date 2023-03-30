import { Injectable } from '@nestjs/common';
import { PaginationParams } from 'src/app/common/dtos/pagination';
import { ProjectPost } from 'src/database/nosql/models';
import { MongoDBService } from 'src/database/nosql/mongodb.service';
import { CreateProjectPostInternalDTO } from './dtos/create-project-post.dto';
import { UpdateProjectPostDTO } from './dtos/update-project-post.dto';

export abstract class ProjectPostsRepository {
  abstract add(data: CreateProjectPostInternalDTO): Promise<ProjectPost>;
  abstract findById(project_post_id: string): Promise<ProjectPost | null>;
  abstract update(
    project_post_id: string,
    data: UpdateProjectPostDTO,
  ): Promise<void>;
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

  async findById(project_post_id: string): Promise<ProjectPost> {
    return await this.mongo.projectPost.findOne({ id: project_post_id });
  }

  async update(
    project_post_id: any,
    data: UpdateProjectPostDTO,
  ): Promise<void> {
    await this.mongo.projectPost.updateOne(
      { id: project_post_id },
      { ...data },
    );
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
