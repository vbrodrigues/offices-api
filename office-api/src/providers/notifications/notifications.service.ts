import { Injectable, Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { Notification } from './notifications.dto';

// Sends notifications from inside the API. Never throws: a notification
// that fails is logged, and the action that triggered it still succeeds.
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  // Null when EMAIL / EMAIL_PASSWORD aren't set: e-mails are only logged
  private readonly transporter: Transporter | null =
    process.env.EMAIL && process.env.EMAIL_PASSWORD
      ? createTransport({
          service: process.env.EMAIL_PROVIDER,
          auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD },
        })
      : null;

  async notify(data: Notification): Promise<void> {
    try {
      if (data.type === 'EMAIL') {
        await this.sendEmail(data);
      } else {
        this.logger.log(`Você tem 1 nova notificação! ${data.content}`);
      }
    } catch (err) {
      this.logger.error(`Error sending ${data.type} notification: ${err}`);
    }
  }

  private async sendEmail({ receiver, content }: Notification) {
    if (!receiver) return;

    if (!this.transporter) {
      this.logger.log(`E-mail not configured. To ${receiver}: ${content}`);
      return;
    }

    await this.transporter.sendMail({
      from: process.env.EMAIL,
      to: receiver,
      subject: content,
      text: `Olá!\n\nVocê tem 1 nova notificação do seu escritório:\n\n${content}`,
    });
  }
}
