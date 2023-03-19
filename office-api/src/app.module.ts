import { Module } from '@nestjs/common';
import { ClientModule } from './app/client/client.module';
import { EmployeeModule } from './app/employee/employee.module';
import { OfficeModule } from './app/office/office.module';
import { RoleModule } from './app/role/role.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ProjectTypeModule } from './app/project-type/project-type.module';
import { NotificationsModule } from './events/notifications.module';
import { ProjectModule } from './app/project/project.module';
import { ProjectFileModule } from './app/project-file/project-file.module';

@Module({
  imports: [
    DatabaseModule,
    OfficeModule,
    ClientModule,
    RoleModule,
    EmployeeModule,
    AuthModule,
    ProjectTypeModule,
    NotificationsModule,
    ProjectModule,
    ProjectFileModule,
  ],
})
export class AppModule {}
