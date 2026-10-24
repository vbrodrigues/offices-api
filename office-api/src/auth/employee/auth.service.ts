import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Employee, Office } from '@prisma/client';
import { validatePassword } from 'src/app/common/utils/hash-password';
import {
  EmployeesRepository,
  EmployeeWithRole,
} from 'src/app/employee/employee.repository';
import { toPublicEmployee } from 'src/app/employee/employee-view';
import { OfficesRepository } from 'src/app/office/office.repository';
import { StorageService } from 'src/providers/storage/storage';
import { EmployeeOffice } from './auth.dtos';
import { ACCESS_LEVEL_PERMISSIONS, Permission } from './permissions';

export interface Me {
  employee: Omit<EmployeeWithRole, 'password'>;
  office: Pick<Office, 'id' | 'name' | 'logo'>;
  // What the UI may offer to this employee
  permissions: Permission[];
}

@Injectable()
export class AuthService {
  constructor(
    private employeesRepository: EmployeesRepository,
    private officesRepository: OfficesRepository,
    private storageService: StorageService,
    private jwtService: JwtService,
  ) {}

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

  // Offices where these credentials are valid, so login doesn't require the
  // user to know their office_id. The same e-mail can exist in many offices.
  async findEmployeeOffices(
    email: string,
    password: string,
  ): Promise<EmployeeOffice[]> {
    const employees = await this.employeesRepository.listByEmail(email);
    const offices: EmployeeOffice[] = [];

    for (const employee of employees) {
      if (await validatePassword(password, employee.password)) {
        offices.push({ id: employee.office.id, name: employee.office.name });
      }
    }

    if (offices.length === 0) {
      throw new UnauthorizedException();
    }

    return offices;
  }

  async me(employee_id: string): Promise<Me> {
    const employee = await this.employeesRepository.findById(employee_id);
    const office =
      employee && (await this.officesRepository.findById(employee.office_id));

    if (!employee || !office) {
      throw new UnauthorizedException();
    }

    return {
      employee: await toPublicEmployee(employee, this.storageService),
      office: {
        id: office.id,
        name: office.name,
        logo: office.logo
          ? await this.storageService.signFile(office.logo)
          : null,
      },
      permissions: ACCESS_LEVEL_PERMISSIONS[employee.access_level],
    };
  }

  async login(employee: Employee) {
    const payload = {
      email: employee.email,
      office_id: employee.office_id,
      aud: 'employee',
      sub: employee.id,
    };
    return { access_token: this.jwtService.sign(payload, { expiresIn: '1d' }) };
  }
}
