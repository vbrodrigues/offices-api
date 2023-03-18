import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProjectScheduleController } from './project-schedule.controller';
import { CreateProjectScheduleUsecase } from './usecases/create-project-schedule.usecase';

@Module({
  imports: [DatabaseModule],
  controllers: [ProjectScheduleController],
  providers: [CreateProjectScheduleUsecase],
  exports: [CreateProjectScheduleUsecase],
})
export class ProjectScheduleModule {}
