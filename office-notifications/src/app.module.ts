import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConsoleMessaageConverter } from './converters/console-message-converter.service';
import { MessageConverter } from './converters/converter.service';
import { ConsoleNotificationService } from './notifications/console-notification.service';
import { NotificationService } from './notifications/notification.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    { provide: NotificationService, useClass: ConsoleNotificationService },
    { provide: MessageConverter, useClass: ConsoleMessaageConverter },
  ],
  exports: [NotificationService, MessageConverter],
})
export class AppModule {}
