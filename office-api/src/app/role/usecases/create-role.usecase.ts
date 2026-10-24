import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CreateRoleDTO } from '../dtos/create-role-dto';
import { RolesRepository } from '../role.repository';

@Injectable()
export class CreateRoleUsecase {
  constructor(private rolesRepository: RolesRepository) {}

  async execute(office_id: string, data: CreateRoleDTO): Promise<Role> {
    const label = data.label.trim();
    const alreadyExists = await this.rolesRepository.findByLabel(
      office_id,
      label,
    );

    if (alreadyExists) {
      throw new BadRequestException('Role already exists.');
    }

    return await this.rolesRepository.add(office_id, label);
  }
}
