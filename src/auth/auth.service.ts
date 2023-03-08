import { Injectable } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { validatePassword } from 'src/app/common/utils/hash-password';
import { EmployeesRepository } from 'src/app/employee/employee.repository';

@Injectable()
export class AuthService {
  constructor(private employeesRepository: EmployeesRepository) {}

  async validateEmployee(
    email: string,
    password: string,
    office_id: string,
  ): Promise<Employee | null> {
    if (!office_id || !email || !password) {
      return null;
    }

    const employee = await this.employeesRepository.findByEmail(
      email,
      office_id,
    );

    if (!employee) {
      return null;
    }

    const validated = await validatePassword(password, employee.password);

    if (!validated) {
      return null;
    }

    return employee;
  }
}
