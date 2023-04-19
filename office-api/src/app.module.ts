import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ClientModule } from './app/client/client.module';
import { EmployeeModule } from './app/employee/employee.module';
import { OfficeModule } from './app/office/office.module';
import { RoleModule } from './app/role/role.module';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from './app/category/category.module';
import { ProjectModule } from './app/project/project.module';
import { ProjectFileModule } from './app/project-file/project-file.module';
import { AuthModule } from './auth/employee/auth.module';
import { ClientAuthModule } from './auth/client/client-auth.module';
import { NotificationsModule } from './events/notifications/notifications.module';
import { ProjectPostsModule } from './events/project-posts/project-posts.module';

import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
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
    ProjectPostsModule,
    StepModule,

    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
