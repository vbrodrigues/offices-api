import { ConfigModule } from '@nestjs/config';

const EnvModule = ConfigModule.forRoot({
  envFilePath: '.env',
  isGlobal: true,
});

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { NotificationServiceFactory } from './notifications/notification-service-factory.service';

@Module({
  imports: [EnvModule],
  controllers: [AppController],
  providers: [NotificationServiceFactory],
})
export class AppModule {}
