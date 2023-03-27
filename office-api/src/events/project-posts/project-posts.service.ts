import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  CreateProjectPostDTO,
  LikeProjectPostDTO,
  UnlikeProjectPostDTO,
} from './project-posts.dto';

@Injectable()
export class ProjectPostsService {
  constructor(@Inject('Kafka') private readonly clientKafka: ClientKafka) {}

  onModuleInit() {
    this.clientKafka.subscribeToResponseOf('office-create-project-post');
    this.clientKafka.subscribeToResponseOf('office-like-project-post');
    this.clientKafka.subscribeToResponseOf('office-unlike-project-post');
    this.clientKafka.connect();
  }

  async create(data: CreateProjectPostDTO) {
    try {
      await lastValueFrom(
        this.clientKafka.send('office-create-project-post', data),
      );
    } catch (err) {
      console.log('Error sending create project post event. Error:', err);
    }
  }

  async like(data: LikeProjectPostDTO) {
    try {
      console.log('Trying to publish on kafka topic like post', data);
      await lastValueFrom(
        this.clientKafka.send('office-like-project-post', data),
      );
    } catch (err) {
      console.log('Error sending like project post event. Error:', err);
    }
  }

  async unlike(data: UnlikeProjectPostDTO) {
    try {
      console.log('Trying to publish on kafka topic unlike post', data);
      await lastValueFrom(
        this.clientKafka.send('office-unlike-project-post', data),
      );
    } catch (err) {
      console.log('Error sending unlike project post event. Error:', err);
    }
  }
}
