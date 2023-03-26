import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProjectPostsModule } from 'src/events/project-posts/project-posts.module';
import { StorageModule } from 'src/providers/storage/storage.module';
import { ProjectScheduleModule } from '../project-schedule/project-schedule.module';
import { ProjectController } from './project.controller';
import { CreateProjectPostUsecase } from './usecases/posts/create-project-post.usecase';
import { CreateProjectUsecase } from './usecases/create-project.usecase';
import { FindProjectUsecase } from './usecases/find-project.usecase';
import { ListProjectsUsecase } from './usecases/list-projects.usecase';
import { RenameProjectUsecase } from './usecases/rename-project.usecase';
import { UpdateProjectStatusUsecase } from './usecases/update-project-status.usecase';
import { LikeProjectPostUsecase } from './usecases/posts/like-project-post.usecase';
import { UnlikeProjectPostUsecase } from './usecases/posts/unlike-project-post.usecase';
import { GetProjectFeedUsecase } from './usecases/posts/get-project-feed.usecase';

@Module({
  imports: [
    DatabaseModule,
    StorageModule,
    ProjectScheduleModule,
    ProjectPostsModule,
  ],
  controllers: [ProjectController],
  providers: [
    CreateProjectUsecase,
    ListProjectsUsecase,
    RenameProjectUsecase,
    UpdateProjectStatusUsecase,
    FindProjectUsecase,
    CreateProjectPostUsecase,
    LikeProjectPostUsecase,
    UnlikeProjectPostUsecase,
    GetProjectFeedUsecase,
    CreateProjectPostUsecase,
  ],
})
export class ProjectModule {}
