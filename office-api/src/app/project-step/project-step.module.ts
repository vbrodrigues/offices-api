import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProjectStepController } from './project-step.controller';
import { CreateProjectStepUsecase } from './usecases/create-project-step.usecase';

@Module({
  imports: [DatabaseModule],
  controllers: [ProjectStepController],
  providers: [CreateProjectStepUsecase],
  exports: [CreateProjectStepUsecase],
})
export class ProjectStepModule {}
