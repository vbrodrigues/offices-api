import { Injectable } from '@nestjs/common';
import { RolesRepository, RoleWithCount } from '../role.repository';

@Injectable()
export class ListRolesUsecase {
  constructor(private rolesRepository: RolesRepository) {}

  async execute(office_id: string): Promise<RoleWithCount[]> {
    return await this.rolesRepository.listByOffice(office_id);
  }
}
