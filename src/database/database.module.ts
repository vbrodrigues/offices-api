import { Module } from '@nestjs/common';
import {
  ClientsRepository,
  ClientsRepositorySQL,
} from 'src/app/client/client.repository';
import {
  OfficesRepository,
  OfficesRepositorySQL,
} from 'src/app/office/office.repository';
import {
  RolesRepository,
  RolesRepositorySQL,
} from 'src/app/role/role.repository';
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
    {
      provide: RolesRepository,
      useClass: RolesRepositorySQL,
    },
  ],
  exports: [OfficesRepository, ClientsRepository, RolesRepository],
})
export class DatabaseModule {}
