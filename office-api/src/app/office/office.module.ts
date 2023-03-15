import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { StorageModule } from 'src/providers/storage/storage.module';
import { OfficeController } from './office.controller';
import { CreateOfficeUsecase } from './usecases/create-office.usecase';
import { EditOfficeUsecase } from './usecases/edit-office.usecase';
import { FindOfficeUsecase } from './usecases/find-office.usecase';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [OfficeController],
  providers: [CreateOfficeUsecase, FindOfficeUsecase, EditOfficeUsecase],
})
export class OfficeModule {}
