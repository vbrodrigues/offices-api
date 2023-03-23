import { Injectable } from '@nestjs/common';
import { ProjectLike } from 'src/database/nosql/models';
import { MongoDBService } from 'src/database/nosql/mongodb.service';
import { CreateProjectLikeInternalDTO } from './dtos/create-project-like.dto';
import { UpdateProjectLikeDTO } from './dtos/update-project-like.dto';

export abstract class ProjectLikesRepository {
  abstract add(data: CreateProjectLikeInternalDTO): Promise<ProjectLike>;
  abstract findByProjectPostId(project_post_id: string): Promise<ProjectLike[]>;
  abstract findByProjectPostIdAndLikerId(
    project_post_id: string,
    liker_id: string,
  ): Promise<ProjectLike | null>;
  abstract update(
    project_like_id: string,
    data: UpdateProjectLikeDTO,
  ): Promise<void>;
}

@Injectable()
export class ProjectLikesRepositoryMongo implements ProjectLikesRepository {
  constructor(private mongo: MongoDBService) {}

  async add(data: CreateProjectLikeInternalDTO): Promise<ProjectLike> {
    const post = new this.mongo.projectLike(data);
    return post.save();
  }

  async findByProjectPostId(project_post_id: string): Promise<ProjectLike[]> {
    return await this.mongo.projectLike
      .find()
      .where({ project_post_id: project_post_id });
  }

  async findByProjectPostIdAndLikerId(
    project_post_id: string,
    liker_id: string,
  ): Promise<ProjectLike | null> {
    return await this.mongo.projectLike.findOne({
      project_post_id: project_post_id,
      liker_id: liker_id,
    });
  }

  async update(project_like_id: string, data: UpdateProjectLikeDTO) {
    await this.mongo.projectLike.updateOne(
      { id: project_like_id },
      { ...data },
    );
  }
}
