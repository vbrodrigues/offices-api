import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common/decorators';
import { Employee } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BaseResponse } from '../common/dtos/responses';
import { CreateEmployeeDTO } from './dtos/create-employee-dto';
import { UpdateEmployeeDTO } from './dtos/update-employee.dto';
import { Request } from '@nestjs/common/decorators/http/route-params.decorator';
import { CreateEmployeeUsecase } from './usecases/create-employee.usecase';
import { EditEmployeeUsecase } from './usecases/edit-employee.usecase';
import { InactivateEmployeeUsecase } from './usecases/inactivate-employee.usecase';

@Controller('/employees')
export class EmployeeController {
  constructor(
    private createEmployee: CreateEmployeeUsecase,
    private editEmployee: EditEmployeeUsecase,
    private inactivateEmployee: InactivateEmployeeUsecase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() request: CreateEmployeeDTO): Promise<Employee> {
    const employee = await this.createEmployee.execute(request);
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
}
