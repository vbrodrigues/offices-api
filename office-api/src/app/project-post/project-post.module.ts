import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { StorageModule } from 'src/providers/storage/storage.module';
import { ProjectScheduleModule } from '../project-schedule/project-schedule.module';
import { ProjectPostController } from './project-post.controller';
import { CreateProjectPostUsecase } from './usecases/create-project-post.usecase';
import { GetProjectFeedUsecase } from './usecases/get-project-feed.usecase';

@Module({
  imports: [DatabaseModule, StorageModule, ProjectScheduleModule],
  controllers: [ProjectPostController],
  providers: [CreateProjectPostUsecase, GetProjectFeedUsecase],
})
export class ProjectPostModule {}
