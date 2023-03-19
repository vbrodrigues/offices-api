import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { EmployeesRepository } from '../employee.repository';

@Injectable()
export class FindEmployeeUsecase {
  constructor(private employeesReository: EmployeesRepository) {}

  async execute(
    office_id: string,
    employee_id: string,
  ): Promise<Employee | null> {
    const employee = await this.employeesReository.findById(employee_id);

    if (!employee) {
      throw new UnauthorizedException();
    }

    if (office_id !== employee.office_id) {
      throw new UnauthorizedException();
    }

    return employee;
  }
}
