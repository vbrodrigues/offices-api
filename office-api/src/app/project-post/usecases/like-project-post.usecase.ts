import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Client, Employee } from '@prisma/client';
import { ClientsRepository } from 'src/app/client/client.repository';
import { EmployeesRepository } from 'src/app/employee/employee.repository';
import { CreateProjectLikeDTO } from 'src/app/project-like/dtos/create-project-like.dto';
import { ProjectLikesRepository } from 'src/app/project-like/project-like.repository';
import { ProjectLike } from 'src/database/nosql/models';
import { ProjectPostsRepository } from '../project-post.repository';
import { v4 as uuid } from 'uuid';

@Injectable()
export class LikeProjectPostUsecase {
  constructor(
    private projectLikesRepository: ProjectLikesRepository,
    private projectPostsRepository: ProjectPostsRepository,
    private clientsRepository: ClientsRepository,
    private employeesRepository: EmployeesRepository,
  ) {}

  async execute(data: CreateProjectLikeDTO): Promise<ProjectLike> {
    const projectPost = await this.projectPostsRepository.findById(
      data.project_post_id,
    );

    if (!projectPost) {
      throw new UnauthorizedException();
    }

    let liker: Client | Employee | null;
    if (data.liker_type === 'client') {
      liker = await this.clientsRepository.findById(data.liker_id);
    } else {
      liker = await this.employeesRepository.findById(data.liker_id);
    }

    if (!liker) {
      throw new UnauthorizedException();
    }

    let like: ProjectLike | null;
    like = await this.projectLikesRepository.findByProjectPostIdAndLikerId(
      data.project_post_id,
      liker.id,
    );

    if (like) {
      if (!like.is_active) {
        await this.projectLikesRepository.update(like.id, { is_active: true });
        const newLikes = projectPost.likes++;
        await this.projectPostsRepository.update(projectPost.id, {
          likes: newLikes,
        });
      }
    } else {
      like = await this.projectLikesRepository.add({
        ...data,
        id: uuid(),
        is_active: true,
        created_at: new Date(),
      });

      const newLikes = projectPost.likes + 1;
      await this.projectPostsRepository.update(projectPost.id, {
        likes: newLikes,
      });
    }

    return like;
  }
}
