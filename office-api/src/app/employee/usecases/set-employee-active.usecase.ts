import { BadRequestException, Injectable } from '@nestjs/common';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { EmployeesRepository } from '../employee.repository';
import { assertCanManageEmployee } from '../employee-rules';

// Inactivates or reactivates an employee. Inactive employees can't log in,
// and their open sessions stop working on the next request.
@Injectable()
export class SetEmployeeActiveUsecase {
  constructor(private employeesRepository: EmployeesRepository) {}

  async execute(
    caller: OfficeRequest['user'],
    employee_id: string,
    is_active: boolean,
  ): Promise<void> {
    const employee = await this.employeesRepository.findById(employee_id);

    if (!employee) {
      throw new BadRequestException('employee not found.');
    }

    assertCanManageEmployee(caller, employee);

    if (employee.is_active === is_active) {
      throw new BadRequestException(
        is_active ? 'employee already active.' : 'employee already inactive.',
      );
    }

    await this.employeesRepository.update(employee_id, { is_active });
  }
}
