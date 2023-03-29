import { Injectable } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { StorageService } from 'src/providers/storage/storage';
import { EmployeesRepository } from '../employee.repository';

@Injectable()
export class ListEmployeesUsecase {
  constructor(
    private employeesRepository: EmployeesRepository,
    private storageService: StorageService,
  ) {}

  async execute(office_id: string): Promise<Employee[]> {
    const employees = await this.employeesRepository.findByOfficeId(office_id);

    const signedEmployees = Promise.all(
      employees.map(async (employee) => {
        return {
          ...employee,
          avatar: employee.avatar
            ? await this.storageService.signFile(employee.avatar)
            : employee.avatar,
        };
      }),
    );

    return signedEmployees;
  }
}
