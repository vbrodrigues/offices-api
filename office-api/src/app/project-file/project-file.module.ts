import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { NotificationsModule } from 'src/events/notifications/notifications.module';
import { StorageModule } from 'src/providers/storage/storage.module';
import { ProjectFileController } from './project-file.controller';
import { CreateProjectFileUsecase } from './usecases/create-project-file.usecase';
import { RemoveProjectFileUsecase } from './usecases/remove-project-file.usecase';

@Module({
  imports: [DatabaseModule, StorageModule, NotificationsModule],
  controllers: [ProjectFileController],
  providers: [CreateProjectFileUsecase, RemoveProjectFileUsecase],
})
export class ProjectFileModule {}
