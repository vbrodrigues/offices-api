import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { StepController } from './step.controller';
import { CreateStepUsecase } from './usecases/create-step.usecase';

@Module({
  imports: [DatabaseModule],
  controllers: [StepController],
  providers: [CreateStepUsecase],
  exports: [CreateStepUsecase],
})
export class StepModule {}
