import { Injectable } from '@nestjs/common';
import { Notification } from 'src/notifications/notifications.dto';
import { MessageConverter } from './converter.service';

@Injectable()
export class ConsoleMessaageConverter implements MessageConverter {
  async convert(data: Notification): Promise<any> {
    const message = `Você tem 1 nova notificação!\n\n\t ${JSON.stringify(
      data.content,
    )}`;
    return message;
  }
}
