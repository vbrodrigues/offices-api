import { BadRequestException, Injectable } from '@nestjs/common';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { RolesRepository } from 'src/app/role/role.repository';
import { StorageService } from 'src/providers/storage/storage';
import { EditEmployeeDTO } from '../dtos/update-employee.dto';
import { EmployeesRepository } from '../employee.repository';
import { assertCanManageEmployee, assertRoleOfOffice } from '../employee-rules';
import { uploadAvatar } from '../employee-view';

@Injectable()
export class EditEmployeeUsecase {
  constructor(
    private employeesRepository: EmployeesRepository,
    private rolesRepository: RolesRepository,
    private storageService: StorageService,
  ) {}

  async execute(
    caller: OfficeRequest['user'],
    employee_id: string,
    request: EditEmployeeDTO,
  ): Promise<void> {
    const employee = await this.employeesRepository.findById(employee_id);

    if (!employee) {
      throw new BadRequestException('Employee not found.');
    }

    assertCanManageEmployee(caller, employee);
    await assertRoleOfOffice(
      this.rolesRepository,
      employee.office_id,
      request.role_id,
    );

    if (request.email && request.email !== employee.email) {
      const sameEmail = await this.employeesRepository.findByEmail(
        request.email,
        employee.office_id,
      );

      if (sameEmail) {
        throw new BadRequestException('Employee already exists.');
      }
    }

    // Only fields present in the request change; null clears them
    await this.employeesRepository.update(employee.id, {
      ...(request.name !== undefined && { name: request.name.trim() }),
      ...(request.email !== undefined && { email: request.email }),
      ...(request.phone_number !== undefined && {
        phone_number: request.phone_number,
      }),
      ...(request.role_id !== undefined && {
        role_id: request.role_id || null,
      }),
      ...(request.avatar && {
        avatar: await uploadAvatar(
          this.storageService,
          employee,
          request.avatar,
        ),
      }),
    });
  }
}
