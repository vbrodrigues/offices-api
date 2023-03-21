import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common/decorators';
import { Employee } from '@prisma/client';
import { BaseResponse } from '../common/dtos/responses';
import { CreateEmployeeDTO } from './dtos/create-employee-dto';
import { UpdateEmployeeDTO } from './dtos/update-employee.dto';
import { Request } from '@nestjs/common/decorators/http/route-params.decorator';
import { CreateEmployeeUsecase } from './usecases/create-employee.usecase';
import { EditEmployeeUsecase } from './usecases/edit-employee.usecase';
import { InactivateEmployeeUsecase } from './usecases/inactivate-employee.usecase';
import { ListEmployeesUsecase } from './usecases/list-employees.usecase';
import { FindEmployeeUsecase } from './usecases/find-employee.usecase';
import { JwtAuthGuard } from 'src/auth/employee/jwt-auth.guard';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';

@Controller('/employees')
export class EmployeeController {
  constructor(
    private createEmployee: CreateEmployeeUsecase,
    private editEmployee: EditEmployeeUsecase,
    private inactivateEmployee: InactivateEmployeeUsecase,
    private listEmployees: ListEmployeesUsecase,
    private findEmployee: FindEmployeeUsecase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() { user: { office_id } }: OfficeRequest,
    @Body() request: CreateEmployeeDTO,
  ): Promise<Employee> {
    const employee = await this.createEmployee.execute(office_id, request);
    return employee;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':employee_id')
  async update(
    @Param('employee_id') employee_id: string,
    @Body() data: UpdateEmployeeDTO,
    @Request() request,
  ): Promise<BaseResponse> {
    await this.editEmployee.execute(employee_id, request.user.office_id, data);
    return { success: true, message: 'Employee edited.' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':employee_id')
  async delete(
    @Param('employee_id') employee_id: string,
    @Request() request,
  ): Promise<BaseResponse> {
    await this.inactivateEmployee.execute(employee_id, request.user.office_id);
    return { success: true, message: 'Employee inactivated.' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async show(
    @Request() { user: { office_id } }: OfficeRequest,
  ): Promise<Employee[]> {
    return await this.listEmployees.execute(office_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:employee_id')
  async index(
    @Request() { user: { office_id } }: OfficeRequest,
    @Param('employee_id') employee_id: string,
  ): Promise<Employee | null> {
    return await this.findEmployee.execute(office_id, employee_id);
  }
}
