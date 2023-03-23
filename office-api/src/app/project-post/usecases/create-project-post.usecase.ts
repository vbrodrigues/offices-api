import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectPost } from 'src/database/nosql/models';
import { StorageService } from 'src/providers/storage/storage';
import { CreateProjectPostDTO } from '../dtos/create-project-post.dto';
import { ProjectPostsRepository } from '../project-post.repository';
import { decodeBase64 } from 'src/app/common/utils/base64';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { EmployeesRepository } from 'src/app/employee/employee.repository';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CreateProjectPostUsecase {
  constructor(
    private projectPostsRepository: ProjectPostsRepository,
    private projectsRepository: ProjectsRepository,
    private employeesRepository: EmployeesRepository,
    private storageService: StorageService,
  ) {}

  async execute(
    office_id: string,
    data: CreateProjectPostDTO,
  ): Promise<ProjectPost> {
    if (office_id !== data.office_id) {
      throw new UnauthorizedException();
    }

    const project = await this.projectsRepository.findById(data.project_id);

    if (!project) {
      throw new UnauthorizedException();
    }

    const employee = await this.employeesRepository.findById(data.employee_id);

    if (!employee) {
      throw new UnauthorizedException();
    }

    const project_post_id = uuid();

    let mediaStoragePath: string;
    if (data.encoded_media) {
      const mediaFile = decodeBase64(data.encoded_media);
      const mediaFilepath = `offices/${office_id}/clients/${project.client.id}/projects/${data.project_id}/posts/${project_post_id}/media/media.${data.encoded_media_format}`;

      mediaStoragePath = await this.storageService.uploadFile(
        mediaFile,
        mediaFilepath,
      );
    }

    return await this.projectPostsRepository.add({
      ...data,
      id: project_post_id,
      media_path: mediaStoragePath,
      likes: 0,
      created_at: new Date(),
    });
  }
}
