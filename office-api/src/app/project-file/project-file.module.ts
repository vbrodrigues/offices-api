import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { StorageModule } from 'src/providers/storage/storage.module';
import { ProjectFileController } from './project-file.controller';
import { CreateProjectFileUsecase } from './usecases/create-project-file.usecase';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [ProjectFileController],
  providers: [CreateProjectFileUsecase],
})
export class ProjectFileModule {}