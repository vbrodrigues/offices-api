import { CacheModule, Module } from '@nestjs/common';
import { ClientModule } from './app/client/client.module';
import { EmployeeModule } from './app/employee/employee.module';
import { OfficeModule } from './app/office/office.module';
import { RoleModule } from './app/role/role.module';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from './app/category/category.module';
import { ProjectModule } from './app/project/project.module';
import { ProjectFileModule } from './app/project-file/project-file.module';
import { ProjectFolderModule } from './app/project-folder/project-folder.module';
import { AuthModule } from './auth/employee/auth.module';
import { ClientAuthModule } from './auth/client/client-auth.module';
import { NotificationsModule } from './providers/notifications/notifications.module';
import { ProjectPostModule } from './app/project-post/project-post.module';

import { StepModule } from './app/step/step.module';

@Module({
  imports: [
    DatabaseModule,
    OfficeModule,
    ClientModule,
    RoleModule,
    EmployeeModule,
    AuthModule,
    ClientAuthModule,
    CategoryModule,
    NotificationsModule,
    ProjectModule,
    ProjectFileModule,
    ProjectFolderModule,
    ProjectPostModule,
    StepModule,

    // In memory, per process. Entries live a few seconds (ttl in seconds,
    // passed as { ttl } on each set), so a single API instance is enough.
    CacheModule.register({ isGlobal: true, max: 1000 }),
  ],
})
export class AppModule {}
