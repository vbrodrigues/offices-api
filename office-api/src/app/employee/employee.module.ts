import { Module } from '@nestjs/common/decorators';
import { DatabaseModule } from 'src/database/database.module';
import { StorageModule } from 'src/providers/storage/storage.module';
import { EmployeeController } from './employee.controller';
import { CreateEmployeeUsecase } from './usecases/create-employee.usecase';
import { EditEmployeeUsecase } from './usecases/edit-employee.usecase';
import { FindEmployeeUsecase } from './usecases/find-employee.usecase';
import { SetEmployeeActiveUsecase } from './usecases/set-employee-active.usecase';
import { ListEmployeesUsecase } from './usecases/list-employees.usecase';
import { ChangeAccessLevelUsecase } from './usecases/change-access-level.usecase';
import {
  ChangeMyPasswordUsecase,
  EditMyProfileUsecase,
} from './usecases/my-profile.usecase';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [EmployeeController],
  providers: [
    CreateEmployeeUsecase,
    EditEmployeeUsecase,
    SetEmployeeActiveUsecase,
    ChangeAccessLevelUsecase,
    EditMyProfileUsecase,
    ChangeMyPasswordUsecase,
    ListEmployeesUsecase,
    FindEmployeeUsecase,
  ],
})
export class EmployeeModule {}
