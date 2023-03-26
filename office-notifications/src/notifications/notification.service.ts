import { Notification } from './notifications.dto';

export abstract class NotificationService {
  abstract notify(data: Notification): Promise<void>;
}
