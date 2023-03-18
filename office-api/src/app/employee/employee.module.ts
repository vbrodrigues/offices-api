import { Module } from '@nestjs/common/decorators';
import { DatabaseModule } from 'src/database/database.module';
import { StorageModule } from 'src/providers/storage/storage.module';
import { EmployeeController } from './employee.controller';
import { CreateEmployeeUsecase } from './usecases/create-employee.usecase';
import { EditEmployeeUsecase } from './usecases/edit-employee.usecase';
import { InactivateEmployeeUsecase } from './usecases/inactivate-employee.usecase';
import { ListEmployeesUsecase } from './usecases/list-employees.usecase';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [EmployeeController],
  providers: [
    CreateEmployeeUsecase,
    EditEmployeeUsecase,
    InactivateEmployeeUsecase,
    ListEmployeesUsecase,
  ],
})
export class EmployeeModule {}
