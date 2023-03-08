import { Body, Controller, Post } from '@nestjs/common/decorators';
import { Employee } from '@prisma/client';
import { CreateEmployeeDTO } from './dtos/create-employee-dto';
import { CreateEmployeeUsecase } from './usecases/create-employee.usecase';

@Controller('/employees')
export class EmployeeController {
  constructor(private createEmployee: CreateEmployeeUsecase) {}

  @Post()
  async create(@Body() request: CreateEmployeeDTO): Promise<Employee> {
    const employee = await this.createEmployee.execute(request);
    return employee;
  }
}
