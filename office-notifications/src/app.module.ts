import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MessageConverter } from './converters/converter.service';
import { NotificationServiceFactory } from './notifications/notification-service-factory.service';
import { NotificationService } from './notifications/notification.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [NotificationServiceFactory],
  exports: [NotificationService, MessageConverter],
})
export class AppModule {}
