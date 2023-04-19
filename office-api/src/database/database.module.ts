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
  ProjectStepsRepository,
  ProjectStepsRepositorySQL,
} from 'src/app/project-step/project-step.repository';
import {
  CategoriesRepository,
  CategoriesRepositorySQL,
} from 'src/app/category/category.repository';
import {
  ProjectsRepository,
  ProjectsRepositorySQL,
} from 'src/app/project/project.repository';
import {
  RolesRepository,
  RolesRepositorySQL,
} from 'src/app/role/role.repository';
import { PrismaService } from './prisma-service';
import {
  StepsRepository,
  StepsRepositorySQL,
} from 'src/app/step/step.repository';

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
      provide: CategoriesRepository,
      useClass: CategoriesRepositorySQL,
    },
    {
      provide: ProjectsRepository,
      useClass: ProjectsRepositorySQL,
    },
    {
      provide: ProjectStepsRepository,
      useClass: ProjectStepsRepositorySQL,
    },
    {
      provide: ProjectFilesRepository,
      useClass: ProjectFilesRepositorySQL,
    },
    {
      provide: StepsRepository,
      useClass: StepsRepositorySQL,
    },
  ],
  exports: [
    OfficesRepository,
    ClientsRepository,
    RolesRepository,
    EmployeesRepository,
    CategoriesRepository,
    ProjectsRepository,
    ProjectStepsRepository,
    ProjectFilesRepository,
    StepsRepository,
  ],
})
export class DatabaseModule {}
