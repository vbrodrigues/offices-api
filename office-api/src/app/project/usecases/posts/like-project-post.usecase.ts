import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Client, Employee } from '@prisma/client';
import { ClientsRepository } from 'src/app/client/client.repository';
import { EmployeesRepository } from 'src/app/employee/employee.repository';
import { ProjectPostsService } from 'src/events/project-posts/project-posts.service';
import { LikeProjectPostDTO } from 'src/events/project-posts/project-posts.dto';

@Injectable()
export class LikeProjectPostUsecase {
  constructor(
    private clientsRepository: ClientsRepository,
    private employeesRepository: EmployeesRepository,
    private projectPostsService: ProjectPostsService,
  ) {}

  async execute(data: LikeProjectPostDTO): Promise<void> {
    let liker: Client | Employee | null;
    if (data.liker_type === 'client') {
      liker = await this.clientsRepository.findById(data.liker_id);
    } else {
      liker = await this.employeesRepository.findById(data.liker_id);
    }

    if (!liker) {
      throw new UnauthorizedException();
    }

    await this.projectPostsService.like(data);
  }
}
