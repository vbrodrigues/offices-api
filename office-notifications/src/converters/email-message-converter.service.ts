import { Injectable } from '@nestjs/common';
import { Notification } from 'src/notifications/notifications.dto';
import { MessageConverter } from './converter.service';

@Injectable()
export class EmailMessageConverter implements MessageConverter {
  async convert(data: Notification): Promise<any> {
    let message = '';

    if (data.receiver) {
      message = message + `Olá ${data.receiver}!\n\n`;
      message = message + `Você tem 1 nova notificação fo seu escritório!\n\n`;
      message = message + `${data.content}`;
    }

    return message;
  }
}
