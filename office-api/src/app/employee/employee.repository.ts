import { Injectable } from '@nestjs/common';
import { Employee, Office } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import { hashPassword } from '../common/utils/hash-password';
import { CreateEmployeeDTO } from './dtos/create-employee-dto';
import { UpdateEmployeeDTO } from './dtos/update-employee.dto';

export type EmployeeWithOffice = Employee & { office: Office };

export abstract class EmployeesRepository {
  abstract add(data: CreateEmployeeDTO): Promise<Employee>;
  abstract findByEmail(
    email: string,
    office_id: string,
  ): Promise<Employee | null>;
  abstract listByEmail(email: string): Promise<EmployeeWithOffice[]>;
  abstract findById(employee_id: string): Promise<Employee | null>;
  abstract findByOfficeId(office_id: string): Promise<Employee[]>;
  abstract update(employee_id: string, data: UpdateEmployeeDTO): Promise<void>;
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

  async listByEmail(email: string): Promise<EmployeeWithOffice[]> {
    return await this.prisma.employee.findMany({
      where: { email, is_active: true },
      include: { office: true },
    });
  }

  async findById(employee_id: string): Promise<Employee> {
    return await this.prisma.employee.findUnique({
      where: { id: employee_id },
    });
  }

  async findByOfficeId(office_id: string): Promise<Employee[]> {
    return await this.prisma.employee.findMany({
      where: { office_id: office_id },
    });
  }

  async update(employee_id: string, data: UpdateEmployeeDTO): Promise<void> {
    const raw = { ...data, updated_at: new Date() };
    await this.prisma.employee.update({
      where: {
        id: employee_id,
      },
      data: raw,
    });
  }
}
