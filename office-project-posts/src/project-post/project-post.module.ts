import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { NotificationsModule } from 'src/events/notifications.module';
import { StorageModule } from 'src/providers/storage/storage.module';
import { ProjectPostController } from './project-post.controller';
import { CreateProjectPostUsecase } from './usecases/create-project-post.usecase';
import { GetProjectFeedUsecase } from './usecases/get-project-feed.usecase';
import { LikeProjectPostUsecase } from './usecases/like-project-post.usecase';
import { UnlikeProjectPostUsecase } from './usecases/unlike-project-post.usecase';

@Module({
  imports: [DatabaseModule, NotificationsModule, StorageModule],
  controllers: [ProjectPostController],
  providers: [
    CreateProjectPostUsecase,
    GetProjectFeedUsecase,
    LikeProjectPostUsecase,
    UnlikeProjectPostUsecase,
  ],
})
export class ProjectPostModule {}
