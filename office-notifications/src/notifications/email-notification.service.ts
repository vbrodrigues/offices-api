import { Injectable } from '@nestjs/common';
import { MessageConverter } from 'src/converters/converter.service';
import { NotificationService } from './notification.service';
import { Notification } from './notifications.dto';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailNotificationService implements NotificationService {
  transporter: Transporter;

  constructor(private messageConverter: MessageConverter) {
    this.transporter = createTransport({
      service: process.env.EMAIL_PROVIDER,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async notify(data: Notification): Promise<void> {
    const formattedMessage = await this.messageConverter.convert(data);
    this.transporter.sendMail(
      {
        from: process.env.EMAIL,
        to: data.receiver,
        subject: data.content,
        text: formattedMessage,
      },
      (err, response) => {
        if (err) {
          console.log('Error sending email. Error:', err);
        } else {
          console.log('Email sent. Response:', response);
        }
      },
    );
  }
}
