import { Module } from '@nestjs/common/decorators';
import { DatabaseModule } from 'src/database/database.module';
import { StorageModule } from 'src/providers/storage/storage.module';
import { EmployeeController } from './employee.controller';
import { CreateEmployeeUsecase } from './usecases/create-employee.usecase';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [EmployeeController],
  providers: [CreateEmployeeUsecase],
})
export class EmployeeModule {}
