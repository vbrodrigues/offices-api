import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProjectLikesRepository,
  ProjectLikesRepositoryMongo,
} from 'src/project-like/project-like.repository';
import {
  ProjectPostsRepository,
  ProjectPostsRepositoryMongo,
} from 'src/project-post/project-post.repository';
import {
  ProjectLike,
  ProjectLikeSchema,
  ProjectPost,
  ProjectPostSchema,
} from './nosql/models';
import { MongoDBService } from './nosql/mongodb.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI, { dbName: 'office' }),
    MongooseModule.forFeature([
      { name: ProjectPost.name, schema: ProjectPostSchema },
      { name: ProjectLike.name, schema: ProjectLikeSchema },
    ]),
  ],
  providers: [
    MongoDBService,
    {
      provide: ProjectPostsRepository,
      useClass: ProjectPostsRepositoryMongo,
    },
    {
      provide: ProjectLikesRepository,
      useClass: ProjectLikesRepositoryMongo,
    },
  ],
  exports: [ProjectPostsRepository, ProjectLikesRepository],
})
export class DatabaseModule {}
