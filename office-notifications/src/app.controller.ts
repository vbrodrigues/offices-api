import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationServiceFactory } from './notifications/notification-service-factory.service';
import { Notification } from './notifications/notifications.dto';

@Controller()
export class AppController {
  constructor(private notificationServiceFactory: NotificationServiceFactory) {}

  @MessagePattern('office-notifications')
  async test(data: Notification) {
    const notificationService =
      this.notificationServiceFactory.getNotificationService(data.type);
    await notificationService.notify(data);
  }
}
