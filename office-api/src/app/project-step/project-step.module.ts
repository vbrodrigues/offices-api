import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProjectStepController } from './project-step.controller';
import { CreateProjectStepUsecase } from './usecases/create-project-step.usecase';
import { UpdateProjectStepUsecase } from './usecases/update-project-step.usecase';

@Module({
  imports: [DatabaseModule],
  controllers: [ProjectStepController],
  providers: [CreateProjectStepUsecase, UpdateProjectStepUsecase],
  exports: [CreateProjectStepUsecase, UpdateProjectStepUsecase],
})
export class ProjectStepModule {}
