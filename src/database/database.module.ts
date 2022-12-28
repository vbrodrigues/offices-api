import { Module } from '@nestjs/common';
import {
  OfficesRepository,
  OfficesRepositorySQL,
} from 'src/office/database/offices-repository';
import { PrismaService } from './prisma-service';

@Module({
  providers: [
    PrismaService,
    {
      provide: OfficesRepository,
      useClass: OfficesRepositorySQL,
    },
  ],
  exports: [OfficesRepository],
})
export class DatabaseModule {}
