import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { OfficeController } from './office.controller';
import { CreateOfficeUsecase } from './usecases/create-office.usecase';
import { FindOfficeUsecase } from './usecases/find-office.usecase';
import { ListOfficeClientsUsecase } from './usecases/list-office-clients';

@Module({
  imports: [DatabaseModule],
  controllers: [OfficeController],
  providers: [CreateOfficeUsecase, FindOfficeUsecase, ListOfficeClientsUsecase],
})
export class OfficeModule {}
