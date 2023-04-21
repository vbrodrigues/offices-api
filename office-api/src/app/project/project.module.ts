import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProjectPostsModule } from 'src/events/project-posts/project-posts.module';
import { StorageModule } from 'src/providers/storage/storage.module';
import { ProjectStepModule } from '../project-step/project-step.module';
import { ProjectController } from './project.controller';
import { CreateProjectPostUsecase } from './usecases/posts/create-project-post.usecase';
import { CreateProjectUsecase } from './usecases/create-project.usecase';
import { FindProjectUsecase } from './usecases/find-project.usecase';
import { ListProjectsUsecase } from './usecases/list-projects.usecase';
import { RenameProjectUsecase } from './usecases/rename-project.usecase';
import { LikeProjectPostUsecase } from './usecases/posts/like-project-post.usecase';
import { UnlikeProjectPostUsecase } from './usecases/posts/unlike-project-post.usecase';
import { GetProjectFeedUsecase } from './usecases/posts/get-project-feed.usecase';
import { NotificationsModule } from 'src/events/notifications/notifications.module';
import { AddStepToProjectUsecase } from './usecases/steps/add-step-to-project.usecase';
import { UpdateStepUsecase } from './usecases/steps/update-step.usecase';
import { ListProjectStepsUsecase } from './usecases/steps/list-project-steps.usecase';

@Module({
  imports: [
    DatabaseModule,
    StorageModule,
    ProjectStepModule,
    ProjectPostsModule,
    NotificationsModule,
  ],
  controllers: [ProjectController],
  providers: [
    CreateProjectUsecase,
    ListProjectsUsecase,
    RenameProjectUsecase,
    FindProjectUsecase,
    CreateProjectPostUsecase,
    LikeProjectPostUsecase,
    UnlikeProjectPostUsecase,
    GetProjectFeedUsecase,
    CreateProjectPostUsecase,
    AddStepToProjectUsecase,
    UpdateStepUsecase,
    ListProjectStepsUsecase,
  ],
})
export class ProjectModule {}
