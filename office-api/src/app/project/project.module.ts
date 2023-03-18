import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { StorageModule } from 'src/providers/storage/storage.module';
import { ProjectController } from './project.controller';
import { CreateProjectUsecase } from './usecases/create-project.usecase';
import { ListProjectsUsecase } from './usecases/list-projects.usecase';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [ProjectController],
  providers: [CreateProjectUsecase, ListProjectsUsecase],
})
export class ProjectModule {}
