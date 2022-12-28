import { Module } from '@nestjs/common';
import {
  ClientsRepository,
  ClientsRepositorySQL,
} from 'src/app/client/client.repository';
import {
  OfficesRepository,
  OfficesRepositorySQL,
} from 'src/app/office/office.repository';
import { PrismaService } from './prisma-service';

@Module({
  providers: [
    PrismaService,
    {
      provide: OfficesRepository,
      useClass: OfficesRepositorySQL,
    },
    {
      provide: ClientsRepository,
      useClass: ClientsRepositorySQL,
    },
  ],
  exports: [OfficesRepository, ClientsRepository],
})
export class DatabaseModule {}
