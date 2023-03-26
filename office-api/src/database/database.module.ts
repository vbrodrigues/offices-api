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
  ProjectFilesRepository,
  ProjectFilesRepositorySQL,
} from 'src/app/project-file/project-file.repository';
import {
  ProjectSchedulesRepository,
  ProjectSchedulesRepositorySQL,
} from 'src/app/project-schedule/project-schedule.repository';
import {
  ProjectTypesRepository,
  ProjectTypesRepositorySQL,
} from 'src/app/project-type/project-type.repository';
import {
  ProjectsRepository,
  ProjectsRepositorySQL,
} from 'src/app/project/project.repository';
import {
  RolesRepository,
  RolesRepositorySQL,
} from 'src/app/role/role.repository';
import { PrismaService } from './prisma-service';

@Module({
  imports: [],
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
    {
      provide: ProjectsRepository,
      useClass: ProjectsRepositorySQL,
    },
    {
      provide: ProjectSchedulesRepository,
      useClass: ProjectSchedulesRepositorySQL,
    },
    {
      provide: ProjectFilesRepository,
      useClass: ProjectFilesRepositorySQL,
    },
  ],
  exports: [
    OfficesRepository,
    ClientsRepository,
    RolesRepository,
    EmployeesRepository,
    ProjectTypesRepository,
    ProjectsRepository,
    ProjectSchedulesRepository,
    ProjectFilesRepository,
  ],
})
export class DatabaseModule {}
