import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
  ProjectPostsRepository,
  ProjectPostsRepositoryMongo,
} from 'src/app/project-post/project-post.repository';
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
import { ProjectPost, ProjectPostSchema } from './nosql/models';
import { MongoDBService } from './nosql/mongodb.service';
import { PrismaService } from './prisma-service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI, { dbName: 'office' }),
    MongooseModule.forFeature([
      { name: ProjectPost.name, schema: ProjectPostSchema },
    ]),
  ],
  providers: [
    PrismaService,
    MongoDBService,
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
    {
      provide: ProjectPostsRepository,
      useClass: ProjectPostsRepositoryMongo,
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
    ProjectPostsRepository,
  ],
})
export class DatabaseModule {}
