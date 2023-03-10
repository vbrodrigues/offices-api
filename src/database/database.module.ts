import { Module } from '@nestjs/common';
import {
  ClientsRepository,
  ClientsRepositorySQL,
} from 'src/app/client/client.repository';
import {
  EmployeesRepository,
  EmployeesRepositorySQL,
} from 'src/app/employee/employee.repository';
import {
  OfficesRepository,
  OfficesRepositorySQL,
} from 'src/app/office/office.repository';
import {
  ProjectTypesRepository,
  ProjectTypesRepositorySQL,
} from 'src/app/project-type/project-type.repository';
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
    {
      provide: EmployeesRepository,
      useClass: EmployeesRepositorySQL,
    },
    {
      provide: ProjectTypesRepository,
      useClass: ProjectTypesRepositorySQL,
    },
  ],
  exports: [
    OfficesRepository,
    ClientsRepository,
    RolesRepository,
    EmployeesRepository,
    ProjectTypesRepository,
  ],
})
export class DatabaseModule {}
