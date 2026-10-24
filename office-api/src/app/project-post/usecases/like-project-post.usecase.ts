import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientsRepository } from 'src/app/client/client.repository';
import { EmployeesRepository } from 'src/app/employee/employee.repository';
import { ProjectsRepository } from 'src/app/project/project.repository';
import { NotificationsService } from 'src/providers/notifications/notifications.service';
import { ProjectPostsRepository } from '../project-post.repository';

@Injectable()
export class LikeProjectPostUsecase {
  constructor(
    private projectPostsRepository: ProjectPostsRepository,
    private projectsRepository: ProjectsRepository,
    private clientsRepository: ClientsRepository,
    private employeesRepository: EmployeesRepository,
    private notificationsService: NotificationsService,
  ) {}

  // Only the project's own client can like its posts
  async execute(client_id: string, project_post_id: string): Promise<void> {
    const post = await this.projectPostsRepository.findById(project_post_id);
    const project =
      post && (await this.projectsRepository.findById(post.project_id));

    if (!project || project.client_id !== client_id) {
      throw new UnauthorizedException();
    }

    await this.projectPostsRepository.like(project_post_id, client_id);

    const [client, author] = await Promise.all([
      this.clientsRepository.findById(client_id),
      this.employeesRepository.findById(post.employee_id),
    ]);

    if (author) {
      this.notificationsService.notify({
        type: 'EMAIL',
        receiver: author.email,
        content: `${
          client?.name ?? 'O cliente'
        } curtiu sua publicação no projeto ${project.name}`,
      });
    }
  }
}
