import { Injectable } from '@nestjs/common';
import { StorageService } from 'src/providers/storage/storage';
import { EmployeesRepository, EmployeeWithRole } from '../employee.repository';
import { toPublicEmployee } from '../employee-view';

@Injectable()
export class ListEmployeesUsecase {
  constructor(
    private employeesRepository: EmployeesRepository,
    private storageService: StorageService,
  ) {}

  async execute(
    office_id: string,
  ): Promise<Omit<EmployeeWithRole, 'password'>[]> {
    const employees = await this.employeesRepository.findByOfficeId(office_id);

    return await Promise.all(
      employees.map((employee) =>
        toPublicEmployee(employee, this.storageService),
      ),
    );
  }
}
