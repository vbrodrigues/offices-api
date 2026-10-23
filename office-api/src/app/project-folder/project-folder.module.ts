import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { StorageModule } from 'src/providers/storage/storage.module';
import { ProjectFolderController } from './project-folder.controller';
import { CreateProjectFolderUsecase } from './usecases/create-project-folder.usecase';
import { EditProjectFolderUsecase } from './usecases/edit-project-folder.usecase';
import { ListProjectFoldersUsecase } from './usecases/list-project-folders.usecase';
import { RemoveProjectFolderUsecase } from './usecases/remove-project-folder.usecase';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [ProjectFolderController],
  providers: [
    CreateProjectFolderUsecase,
    ListProjectFoldersUsecase,
    EditProjectFolderUsecase,
    RemoveProjectFolderUsecase,
  ],
})
export class ProjectFolderModule {}
