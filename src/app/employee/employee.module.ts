import { Module } from '@nestjs/common/decorators';
import { DatabaseModule } from 'src/database/database.module';
import { EmployeeController } from './employee.controller';
import { CreateEmployeeUsecase } from './usecases/create-employee.usecase';

@Module({
  imports: [DatabaseModule],
  controllers: [EmployeeController],
  providers: [CreateEmployeeUsecase],
})
export class EmployeeModule {}
