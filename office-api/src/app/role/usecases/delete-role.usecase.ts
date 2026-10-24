import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RolesRepository } from '../role.repository';

@Injectable()
export class DeleteRoleUsecase {
  constructor(private rolesRepository: RolesRepository) {}

  // Employees with this role keep working, just without a job title
  async execute(office_id: string, role_id: string): Promise<void> {
    const role = await this.rolesRepository.findById(role_id);

    if (!role || role.office_id !== office_id) {
      throw new UnauthorizedException();
    }

    await this.rolesRepository.delete(role.id);
  }
}
