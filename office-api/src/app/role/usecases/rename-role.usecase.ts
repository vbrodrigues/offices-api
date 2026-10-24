import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RenameRoleDTO } from '../dtos/create-role-dto';
import { RolesRepository } from '../role.repository';

@Injectable()
export class RenameRoleUsecase {
  constructor(private rolesRepository: RolesRepository) {}

  async execute(
    office_id: string,
    role_id: string,
    data: RenameRoleDTO,
  ): Promise<void> {
    const role = await this.rolesRepository.findById(role_id);

    if (!role || role.office_id !== office_id) {
      throw new UnauthorizedException();
    }

    const label = data.label.trim();
    const sameLabel = await this.rolesRepository.findByLabel(office_id, label);

    if (sameLabel && sameLabel.id !== role.id) {
      throw new BadRequestException('Role already exists.');
    }

    await this.rolesRepository.rename(role.id, label);
  }
}
