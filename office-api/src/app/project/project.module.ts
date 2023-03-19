import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { StorageModule } from 'src/providers/storage/storage.module';
import { ProjectScheduleModule } from '../project-schedule/project-schedule.module';
import { ProjectController } from './project.controller';
import { CreateProjectUsecase } from './usecases/create-project.usecase';
import { ListProjectsUsecase } from './usecases/list-projects.usecase';
import { RenameProjectUsecase } from './usecases/rename-project.usecase';
import { UpdateProjectStatusUsecase } from './usecases/update-project-status.usecase';

@Module({
  imports: [DatabaseModule, StorageModule, ProjectScheduleModule],
  controllers: [ProjectController],
  providers: [
    CreateProjectUsecase,
    ListProjectsUsecase,
    RenameProjectUsecase,
    UpdateProjectStatusUsecase,
  ],
})
export class ProjectModule {}
