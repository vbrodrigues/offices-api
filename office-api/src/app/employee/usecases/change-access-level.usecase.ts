import { BadRequestException, Injectable } from '@nestjs/common';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { ChangeAccessLevelDTO } from '../dtos/update-employee.dto';
import { EmployeesRepository } from '../employee.repository';
import { assertCanGrant, assertCanManageEmployee } from '../employee-rules';

// Makes an employee a PARTNER or back a MEMBER (MANAGE_PARTNERS)
@Injectable()
export class ChangeAccessLevelUsecase {
  constructor(private employeesRepository: EmployeesRepository) {}

  async execute(
    caller: OfficeRequest['user'],
    employee_id: string,
    request: ChangeAccessLevelDTO,
  ): Promise<void> {
    const employee = await this.employeesRepository.findById(employee_id);

    if (!employee) {
      throw new BadRequestException('Employee not found.');
    }

    assertCanManageEmployee(caller, employee);
    assertCanGrant(caller, request.access_level);

    await this.employeesRepository.update(employee.id, {
      access_level: request.access_level,
    });
  }
}
