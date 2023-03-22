import { Injectable } from '@nestjs/common';
import { ProjectPost } from 'src/database/nosql/models';
import { MongoDBService } from 'src/database/nosql/mongodb.service';
import { CreateProjectPostDTO } from './dtos/create-project-posts.dto';

export abstract class ProjectPostsRepository {
  abstract add(data: CreateProjectPostDTO): Promise<ProjectPost>;
}

@Injectable()
export class ProjectPostsRepositoryMongo implements ProjectPostsRepository {
  constructor(private mongo: MongoDBService) {}

  async add(data: CreateProjectPostDTO): Promise<ProjectPost> {
    const post = new this.mongo.projectPost(data);
    return post.save();
  }
}
