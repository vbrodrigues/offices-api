import { Injectable } from '@nestjs/common';
import { MessageConverter } from 'src/converters/converter.service';
import { NotificationService } from './notification.service';

@Injectable()
export class ConsoleNotificationService implements NotificationService {
  constructor(private messageConverter: MessageConverter) {}

  async notify(data: any): Promise<void> {
    const formattedData = await this.messageConverter.convert(data);
    console.log(formattedData);
  }
}
