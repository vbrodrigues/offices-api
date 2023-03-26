import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProjectPostsService } from './project-posts.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'Kafka',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'office-project-posts',
          },
        },
      },
    ]),
  ],
  providers: [ProjectPostsService],
  exports: [ProjectPostsService],
})
export class ProjectPostsModule {}
