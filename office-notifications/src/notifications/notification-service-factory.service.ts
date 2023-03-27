import { ConsoleMessaageConverter } from 'src/converters/console-message-converter.service';
import { ConsoleNotificationService } from './console-notification.service';
import { NotificationService } from './notification.service';

export class NotificationServiceFactory {
  getNotificationService(
    type: 'CONSOLE' | 'SMS' | 'EMAIL',
  ): NotificationService {
    switch (type) {
      case 'CONSOLE':
        const converter = new ConsoleMessaageConverter();
        return new ConsoleNotificationService(converter);
    }
  }
}
