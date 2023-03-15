import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CreateRoleDTO } from '../dtos/create-role-dto';
import { RolesRepository } from '../role.repository';

@Injectable()
export class CreateRoleUsecase {
  constructor(private rolesRepository: RolesRepository) {}

  async execute(data: CreateRoleDTO): Promise<Role> {
    const alreadyExists = await this.rolesRepository.findByLabel(data.label);

    if (alreadyExists) {
      throw new BadRequestException('Role already exists.');
    }

    return await this.rolesRepository.add(data);
  }
}
