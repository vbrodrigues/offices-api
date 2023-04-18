import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { StorageModule } from 'src/providers/storage/storage.module';
import { ProjectTypeController } from './project-type.controller';
import { CreateProjectTypeUsecase } from './usecases/create-project-type.usecase';
import { ListProjectTypesUsecase } from './usecases/list-project-types.usecase';
import { RemoveProjectTypeUsecase } from './usecases/remove-project-type.usecase';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [ProjectTypeController],
  providers: [
    CreateProjectTypeUsecase,
    ListProjectTypesUsecase,
    RemoveProjectTypeUsecase,
  ],
})
export class ProjectTypeModule {}
