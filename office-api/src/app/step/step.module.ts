import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { StepController } from './step.controller';
import { CreateStepUsecase } from './usecases/create-step.usecase';
import { ListStepsUsecase } from './usecases/list-steps.usecase';
import { RemoveStepUsecase } from './usecases/remove-step.usecase';

@Module({
  imports: [DatabaseModule],
  controllers: [StepController],
  providers: [CreateStepUsecase, ListStepsUsecase, RemoveStepUsecase],
  exports: [CreateStepUsecase, ListStepsUsecase, RemoveStepUsecase],
})
export class StepModule {}
