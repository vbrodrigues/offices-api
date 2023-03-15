import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Notification } from './notifications.dto';

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(@Inject('Kafka') private readonly clientKafka: ClientKafka) {}

  async onModuleInit() {
    this.clientKafka.subscribeToResponseOf('office-notifications');
    await this.clientKafka.connect();
  }

  async notify(data: Notification) {
    await this.clientKafka.send('office-notifications', data).toPromise();
  }
}
