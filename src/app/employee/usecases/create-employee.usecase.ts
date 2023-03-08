import { BadRequestException, Injectable } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { CreateEmployeeDTO } from '../dtos/create-employee-dto';
import { EmployeesRepository } from '../employee.repository';

@Injectable()
export class CreateEmployeeUsecase {
  constructor(private employeesRepository: EmployeesRepository) {}

  async execute(data: CreateEmployeeDTO): Promise<Employee> {
    const alreadyExists = await this.employeesRepository.findByEmail(
      data.email,
      data.office_id,
    );

    if (alreadyExists) {
      throw new BadRequestException('Employee already exists.');
    }

    return await this.employeesRepository.add(data);
  }
}
