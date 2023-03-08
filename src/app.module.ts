import { Module } from '@nestjs/common';
import { ClientModule } from './app/client/client.module';
import { EmployeeModule } from './app/employee/employee.module';
import { OfficeModule } from './app/office/office.module';
import { RoleModule } from './app/role/role.module';

@Module({
  imports: [OfficeModule, ClientModule, RoleModule, EmployeeModule],
})
export class AppModule {}
