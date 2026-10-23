import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { NotificationsModule } from 'src/events/notifications/notifications.module';
import { StorageModule } from 'src/providers/storage/storage.module';
import { ProjectFileController } from './project-file.controller';
import { RemoveProjectFileUsecase } from './usecases/remove-project-file.usecase';
import { EditProjectFileUsecase } from './usecases/edit-project-file.usecase';
import { RequestProjectFileUploadsUsecase } from './usecases/request-project-file-uploads.usecase';
import { CreateProjectFilesBatchUsecase } from './usecases/create-project-files-batch.usecase';
import { MoveProjectFilesUsecase } from './usecases/move-project-files.usecase';

@Module({
  imports: [DatabaseModule, StorageModule, NotificationsModule],
  controllers: [ProjectFileController],
  providers: [
    RemoveProjectFileUsecase,
    EditProjectFileUsecase,
    RequestProjectFileUploadsUsecase,
    CreateProjectFilesBatchUsecase,
    MoveProjectFilesUsecase,
  ],
})
export class ProjectFileModule {}
