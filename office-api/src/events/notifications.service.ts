import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Notification } from './notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(@Inject('Kafka') private readonly clientKafka: ClientKafka) {}

  async notify(data: Notification) {
    await lastValueFrom(this.clientKafka.send('office-client-creation', data));
  }
}
