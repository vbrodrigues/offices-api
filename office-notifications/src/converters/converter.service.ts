import { Notification } from 'src/notifications/notifications.dto';

export abstract class MessageConverter {
  abstract convert(data: Notification): Promise<any>;
}
