import { Body, Controller, Get, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CreateRoleDTO } from './dtos/create-role-dto';
import { CreateRoleUsecase } from './usecases/create-role.usecase';
import { ListRolesUsecase } from './usecases/list-roles.usecase';

@Controller('/roles')
export class RoleController {
  constructor(
    private createRole: CreateRoleUsecase,
    private listRoles: ListRolesUsecase,
  ) {}

  @Post()
  async create(@Body() request: CreateRoleDTO): Promise<Role> {
    const role = await this.createRole.execute(request);
    return role;
  }

  @Get()
  async show(): Promise<Role[]> {
    return await this.listRoles.execute();
  }
}
