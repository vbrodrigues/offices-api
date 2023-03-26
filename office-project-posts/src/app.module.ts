import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

const EnvModule = ConfigModule.forRoot({
  envFilePath: '.env',
  isGlobal: true,
});

import { DatabaseModule } from './database/database.module';
import { NotificationsModule } from './events/notifications.module';
import { ProjectPostModule } from './project-post/project-post.module';
import { StorageModule } from './providers/storage/storage.module';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    StorageModule,
    NotificationsModule,
    ProjectPostModule,
  ],
})
export class AppModule {}
