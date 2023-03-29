import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { StorageService } from 'src/providers/storage/storage';
import { EmployeesRepository } from '../employee.repository';

@Injectable()
export class FindEmployeeUsecase {
  constructor(
    private employeesReository: EmployeesRepository,
    private storageService: StorageService,
  ) {}

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

    if (employee.avatar) {
      employee.avatar = await this.storageService.signFile(employee.avatar);
    }

    return employee;
  }
}
