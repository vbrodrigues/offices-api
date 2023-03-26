import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { EmployeesRepository } from 'src/app/employee/employee.repository';
import { ProjectPostsService } from 'src/events/project-posts/project-posts.service';
import { CreateProjectPostDTO } from 'src/events/project-posts/project-posts.dto';

@Injectable()
export class CreateProjectPostUsecase {
  constructor(
    private projectsRepository: ProjectsRepository,
    private employeesRepository: EmployeesRepository,
    private projectPostsService: ProjectPostsService,
  ) {}

  async execute(office_id: string, data: CreateProjectPostDTO): Promise<void> {
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

    await this.projectPostsService.create(data);
  }
}
