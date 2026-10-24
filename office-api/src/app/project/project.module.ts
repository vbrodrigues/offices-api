import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { StorageModule } from 'src/providers/storage/storage.module';
import { ProjectStepModule } from '../project-step/project-step.module';
import { ProjectController } from './project.controller';
import { CreateProjectUsecase } from './usecases/create-project.usecase';
import { FindProjectUsecase } from './usecases/find-project.usecase';
import { ListProjectsUsecase } from './usecases/list-projects.usecase';
import { RenameProjectUsecase } from './usecases/rename-project.usecase';
import { NotificationsModule } from 'src/providers/notifications/notifications.module';
import { AddStepToProjectUsecase } from './usecases/steps/add-step-to-project.usecase';
import { UpdateStepUsecase } from './usecases/steps/update-step.usecase';
import { ListProjectStepsUsecase } from './usecases/steps/list-project-steps.usecase';
import { RemoveStepFromProjectUsecase } from './usecases/steps/remove-step-from-project.usecase';
import { ReorderProjectStepsUsecase } from './usecases/steps/reorder-project-steps.usecase';

@Module({
  imports: [
    DatabaseModule,
    StorageModule,
    ProjectStepModule,
    NotificationsModule,
  ],
  controllers: [ProjectController],
  providers: [
    CreateProjectUsecase,
    ListProjectsUsecase,
    RenameProjectUsecase,
    FindProjectUsecase,
    AddStepToProjectUsecase,
    UpdateStepUsecase,
    ListProjectStepsUsecase,
    RemoveStepFromProjectUsecase,
    ReorderProjectStepsUsecase,
  ],
})
export class ProjectModule {}
