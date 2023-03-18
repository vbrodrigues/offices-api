import { Injectable } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { EmployeesRepository } from '../employee.repository';

@Injectable()
export class ListEmployeesUsecase {
  constructor(private employeesRepository: EmployeesRepository) {}

  async execute(office_id: string): Promise<Employee[]> {
    return await this.employeesRepository.findByOfficeId(office_id);
  }
}
