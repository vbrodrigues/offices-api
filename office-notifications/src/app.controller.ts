import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationService } from './notifications/notification.service';

@Controller()
export class AppController {
  constructor(private notificationService: NotificationService) {}

  @MessagePattern('office-notifications')
  async test(data: any) {
    await this.notificationService.notify(data);
  }
}
