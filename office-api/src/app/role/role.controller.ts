import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { JwtAuthGuard } from 'src/auth/employee/jwt-auth.guard';
import { Permission } from 'src/auth/employee/permissions';
import {
  PermissionsGuard,
  RequirePermission,
} from 'src/auth/employee/permissions.guard';
import { BaseResponse } from '../common/dtos/responses';
import { CreateRoleDTO, RenameRoleDTO } from './dtos/create-role-dto';
import { RoleWithCount } from './role.repository';
import { CreateRoleUsecase } from './usecases/create-role.usecase';
import { DeleteRoleUsecase } from './usecases/delete-role.usecase';
import { ListRolesUsecase } from './usecases/list-roles.usecase';
import { RenameRoleUsecase } from './usecases/rename-role.usecase';

// Job titles of the caller's office
@Controller('/roles')
export class RoleController {
  constructor(
    private createRole: CreateRoleUsecase,
    private listRoles: ListRolesUsecase,
    private renameRole: RenameRoleUsecase,
    private deleteRole: DeleteRoleUsecase,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission(Permission.MANAGE_ROLES)
  @Post()
  async create(
    @Request() { user: { office_id } }: OfficeRequest,
    @Body() request: CreateRoleDTO,
  ): Promise<Role> {
    return await this.createRole.execute(office_id, request);
  }

  // Everyone can read them, e.g. to show an employee's job title
  @UseGuards(JwtAuthGuard)
  @Get()
  async show(
    @Request() { user: { office_id } }: OfficeRequest,
  ): Promise<RoleWithCount[]> {
    return await this.listRoles.execute(office_id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission(Permission.MANAGE_ROLES)
  @Put('/:role_id')
  async rename(
    @Request() { user: { office_id } }: OfficeRequest,
    @Param('role_id') role_id: string,
    @Body() request: RenameRoleDTO,
  ): Promise<BaseResponse> {
    await this.renameRole.execute(office_id, role_id, request);
    return { success: true, message: 'Role renamed.' };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission(Permission.MANAGE_ROLES)
  @Delete('/:role_id')
  async remove(
    @Request() { user: { office_id } }: OfficeRequest,
    @Param('role_id') role_id: string,
  ): Promise<BaseResponse> {
    await this.deleteRole.execute(office_id, role_id);
    return { success: true, message: 'Role deleted.' };
  }
}
