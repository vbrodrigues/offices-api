import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StorageService } from 'src/providers/storage/storage';
import { EmployeesRepository, EmployeeWithRole } from '../employee.repository';
import { toPublicEmployee } from '../employee-view';

@Injectable()
export class FindEmployeeUsecase {
  constructor(
    private employeesRepository: EmployeesRepository,
    private storageService: StorageService,
  ) {}

  async execute(
    office_id: string,
    employee_id: string,
  ): Promise<Omit<EmployeeWithRole, 'password'>> {
    const employee = await this.employeesRepository.findById(employee_id);

    if (!employee || office_id !== employee.office_id) {
      throw new UnauthorizedException();
    }

    return await toPublicEmployee(employee, this.storageService);
  }
}
