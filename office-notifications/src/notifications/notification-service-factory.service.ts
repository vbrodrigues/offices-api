import { ConsoleMessaageConverter } from 'src/converters/console-message-converter.service';
import { EmailMessageConverter } from 'src/converters/email-message-converter.service';
import { ConsoleNotificationService } from './console-notification.service';
import { EmailNotificationService } from './email-notification.service';
import { NotificationService } from './notification.service';

export class NotificationServiceFactory {
  getNotificationService(
    type: 'CONSOLE' | 'SMS' | 'EMAIL',
  ): NotificationService {
    switch (type) {
      case 'CONSOLE':
        return new ConsoleNotificationService(new ConsoleMessaageConverter());
      case 'EMAIL':
        return new EmailNotificationService(new EmailMessageConverter());
    }
  }
}
