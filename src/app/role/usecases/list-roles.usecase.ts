import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { RolesRepository } from '../role.repository';

@Injectable()
export class ListRolesUsecase {
  constructor(private rolesRepository: RolesRepository) {}

  async execute(): Promise<Role[]> {
    return await this.rolesRepository.list();
  }
}
