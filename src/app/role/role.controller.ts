import { Body, Controller, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CreateRoleDTO } from './dtos/create-role-dto';
import { CreateRoleUsecase } from './usecases/create-role.usecase';

@Controller('/roles')
export class RoleController {
  constructor(private createRole: CreateRoleUsecase) {}

  @Post()
  async create(@Body() request: CreateRoleDTO): Promise<Role> {
    const role = await this.createRole.execute(request);
    return role;
  }
}
