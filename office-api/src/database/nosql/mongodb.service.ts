import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProjectLike,
  ProjectLikeDocument,
  ProjectPost,
  ProjectPostDocument,
} from './models';

@Injectable()
export class MongoDBService {
  projectPost: Model<ProjectPostDocument>;
  projectLike: Model<ProjectLikeDocument>;

  constructor(
    @InjectModel(ProjectPost.name)
    projectPost: Model<ProjectPostDocument>,

    @InjectModel(ProjectLike.name)
    projectLike: Model<ProjectLikeDocument>,
  ) {
    this.projectPost = projectPost;
    this.projectLike = projectLike;
  }
}
