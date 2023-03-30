import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ClientModule } from './app/client/client.module';
import { EmployeeModule } from './app/employee/employee.module';
import { OfficeModule } from './app/office/office.module';
import { RoleModule } from './app/role/role.module';
import { DatabaseModule } from './database/database.module';
import { ProjectTypeModule } from './app/project-type/project-type.module';
import { ProjectModule } from './app/project/project.module';
import { ProjectFileModule } from './app/project-file/project-file.module';
import { AuthModule } from './auth/employee/auth.module';
import { ClientAuthModule } from './auth/client/client-auth.module';
import { NotificationsModule } from './events/notifications/notifications.module';
import { ProjectPostsModule } from './events/project-posts/project-posts.module';

import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    DatabaseModule,
    OfficeModule,
    ClientModule,
    RoleModule,
    EmployeeModule,
    AuthModule,
    ClientAuthModule,
    ProjectTypeModule,
    NotificationsModule,
    ProjectModule,
    ProjectFileModule,
    ProjectPostsModule,

    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
