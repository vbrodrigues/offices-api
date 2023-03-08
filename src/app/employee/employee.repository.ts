import { Injectable } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import { hashPassword } from '../common/utils/hash-password';
import { CreateEmployeeDTO } from './dtos/create-employee-dto';

export abstract class EmployeesRepository {
  abstract add(data: CreateEmployeeDTO): Promise<Employee>;
  abstract findByEmail(
    email: string,
    office_id: string,
  ): Promise<Employee | null>;
}

@Injectable()
export class EmployeesRepositorySQL implements EmployeesRepository {
  constructor(private prisma: PrismaService) {}

  async add(data: CreateEmployeeDTO): Promise<Employee> {
    data.password = await hashPassword(data.password);
    const employee = await this.prisma.employee.create({ data: data });
    delete employee.password;
    return employee;
  }

  async findByEmail(email: string, office_id: string): Promise<Employee> {
    return await this.prisma.employee.findFirst({
      where: { email: email, office_id: office_id },
    });
  }
}
