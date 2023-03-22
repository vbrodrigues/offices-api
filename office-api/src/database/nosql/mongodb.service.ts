import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectPost, ProjectPostDocument } from './models';

@Injectable()
export class MongoDBService {
  projectPost: Model<ProjectPostDocument>;
  constructor(
    @InjectModel(ProjectPost.name)
    projectPost: Model<ProjectPostDocument>,
  ) {
    this.projectPost = projectPost;
  }
}
