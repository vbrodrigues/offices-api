import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EmployeesRepository } from '../employee.repository';

@Injectable()
export class InactivateEmployeeUsecase {
  constructor(private employeesRepository: EmployeesRepository) {}

  async execute(employee_id: string, office_id: string): Promise<void> {
    const employee = await this.employeesRepository.findById(employee_id);

    if (!employee) {
      throw new BadRequestException('employee not found.');
    }

    if (employee.office_id !== office_id) {
      throw new UnauthorizedException();
    }

    if (!employee.is_active) {
      throw new BadRequestException('employee already inactive.');
    }

    await this.employeesRepository.update(employee_id, { is_active: false });
  }
}
