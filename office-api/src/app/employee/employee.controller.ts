import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common/decorators';
import { BaseResponse } from '../common/dtos/responses';
import { CreateEmployeeDTO } from './dtos/create-employee-dto';
import {
  ChangeAccessLevelDTO,
  EditEmployeeDTO,
  EditMyProfileDTO,
} from './dtos/update-employee.dto';
import { Request } from '@nestjs/common/decorators/http/route-params.decorator';
import { CreateEmployeeUsecase } from './usecases/create-employee.usecase';
import { EditEmployeeUsecase } from './usecases/edit-employee.usecase';
import { SetEmployeeActiveUsecase } from './usecases/set-employee-active.usecase';
import { ListEmployeesUsecase } from './usecases/list-employees.usecase';
import { FindEmployeeUsecase } from './usecases/find-employee.usecase';
import { ChangeAccessLevelUsecase } from './usecases/change-access-level.usecase';
import {
  ChangeMyPasswordUsecase,
  EditMyProfileUsecase,
} from './usecases/my-profile.usecase';
import { JwtAuthGuard } from 'src/auth/employee/jwt-auth.guard';
import { ChangePasswordDTO, OfficeRequest } from 'src/auth/employee/auth.dtos';
import { Permission } from 'src/auth/employee/permissions';
import {
  PermissionsGuard,
  RequirePermission,
} from 'src/auth/employee/permissions.guard';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common';
import { invalidateEmployeeAuth } from '../common/utils/auth-cache';
import { EmployeeWithRole } from './employee.repository';

type PublicEmployee = Omit<EmployeeWithRole, 'password'>;

@Controller('/employees')
export class EmployeeController {
  constructor(
    private createEmployee: CreateEmployeeUsecase,
    private editEmployee: EditEmployeeUsecase,
    private setEmployeeActive: SetEmployeeActiveUsecase,
    private changeAccessLevel: ChangeAccessLevelUsecase,
    private editMyProfile: EditMyProfileUsecase,
    private changeMyPassword: ChangeMyPasswordUsecase,
    private listEmployees: ListEmployeesUsecase,
    private findEmployee: FindEmployeeUsecase,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // Drops the cached list and, when an employee's access changed, their
  // cached access level / active flag
  private async invalidate(office_id: string, employee_id?: string) {
    await this.cacheManager.del(`employees:${office_id}`);
    if (employee_id)
      await invalidateEmployeeAuth(this.cacheManager, employee_id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission(Permission.MANAGE_EMPLOYEES)
  @Post()
  async create(
    @Request() { user }: OfficeRequest,
    @Body() request: CreateEmployeeDTO,
  ): Promise<Omit<PublicEmployee, 'role'>> {
    const employee = await this.createEmployee.execute(user, request);
    await this.invalidate(user.office_id);
    return employee;
  }

  // /me routes come before /:employee_id so "me" isn't read as an id
  @UseGuards(JwtAuthGuard)
  @Put('/me')
  async updateMe(
    @Request() { user }: OfficeRequest,
    @Body() request: EditMyProfileDTO,
  ): Promise<BaseResponse> {
    await this.editMyProfile.execute(user.employee_id, request);
    await this.invalidate(user.office_id);
    return { success: true, message: 'Profile edited.' };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/me/password')
  async updateMyPassword(
    @Request() { user }: OfficeRequest,
    @Body() request: ChangePasswordDTO,
  ): Promise<BaseResponse> {
    await this.changeMyPassword.execute(user.employee_id, request);
    return { success: true, message: 'Password changed.' };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission(Permission.MANAGE_EMPLOYEES)
  @Put(':employee_id')
  async update(
    @Request() { user }: OfficeRequest,
    @Param('employee_id') employee_id: string,
    @Body() data: EditEmployeeDTO,
  ): Promise<BaseResponse> {
    await this.editEmployee.execute(user, employee_id, data);
    await this.invalidate(user.office_id);
    return { success: true, message: 'Employee edited.' };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission(Permission.MANAGE_PARTNERS)
  @Put(':employee_id/access-level')
  async updateAccessLevel(
    @Request() { user }: OfficeRequest,
    @Param('employee_id') employee_id: string,
    @Body() data: ChangeAccessLevelDTO,
  ): Promise<BaseResponse> {
    await this.changeAccessLevel.execute(user, employee_id, data);
    await this.invalidate(user.office_id, employee_id);
    return { success: true, message: 'Access level changed.' };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission(Permission.MANAGE_EMPLOYEES)
  @Put(':employee_id/reactivate')
  async reactivate(
    @Request() { user }: OfficeRequest,
    @Param('employee_id') employee_id: string,
  ): Promise<BaseResponse> {
    await this.setEmployeeActive.execute(user, employee_id, true);
    await this.invalidate(user.office_id, employee_id);
    return { success: true, message: 'Employee reactivated.' };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission(Permission.MANAGE_EMPLOYEES)
  @Delete(':employee_id')
  async delete(
    @Request() { user }: OfficeRequest,
    @Param('employee_id') employee_id: string,
  ): Promise<BaseResponse> {
    await this.setEmployeeActive.execute(user, employee_id, false);
    await this.invalidate(user.office_id, employee_id);
    return { success: true, message: 'Employee inactivated.' };
  }

  // Everyone can see the team, e.g. to pick who is responsible for a step
  @UseGuards(JwtAuthGuard)
  @Get()
  async show(
    @Request() { user: { office_id } }: OfficeRequest,
  ): Promise<PublicEmployee[]> {
    const cachedResponse = await this.cacheManager.get<PublicEmployee[]>(
      `employees:${office_id}`,
    );

    if (cachedResponse) {
      return cachedResponse;
    }

    const employees = await this.listEmployees.execute(office_id);

    if (employees) {
      await this.cacheManager.set<PublicEmployee[]>(
        `employees:${office_id}`,
        employees,
        { ttl: 5 },
      );
    }

    return employees;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:employee_id')
  async index(
    @Request() { user: { office_id } }: OfficeRequest,
    @Param('employee_id') employee_id: string,
  ): Promise<PublicEmployee> {
    return await this.findEmployee.execute(office_id, employee_id);
  }
}
