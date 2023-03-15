import { Injectable } from '@nestjs/common';
import { MessageConverter } from './converter.service';

@Injectable()
export class ConsoleMessaageConverter implements MessageConverter {
  async convert(data: any): Promise<any> {
    const message = `Você tem 1 nova notificação!\n\n\t ${JSON.stringify(
      data,
    )}`;
    return message;
  }
}
