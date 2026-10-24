import { BadRequestException, Injectable } from '@nestjs/common';
import { validatePassword } from 'src/app/common/utils/hash-password';
import { ChangePasswordDTO } from 'src/auth/employee/auth.dtos';
import { StorageService } from 'src/providers/storage/storage';
import { EditMyProfileDTO } from '../dtos/update-employee.dto';
import { EmployeesRepository } from '../employee.repository';
import { uploadAvatar } from '../employee-view';

// Any employee, whatever their access level, edits their own profile here
@Injectable()
export class EditMyProfileUsecase {
  constructor(
    private employeesRepository: EmployeesRepository,
    private storageService: StorageService,
  ) {}

  async execute(employee_id: string, request: EditMyProfileDTO): Promise<void> {
    const employee = await this.employeesRepository.findById(employee_id);

    if (!employee) {
      throw new BadRequestException('Employee not found.');
    }

    await this.employeesRepository.update(employee.id, {
      ...(request.name !== undefined && { name: request.name.trim() }),
      ...(request.phone_number !== undefined && {
        phone_number: request.phone_number,
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

@Injectable()
export class ChangeMyPasswordUsecase {
  constructor(private employeesRepository: EmployeesRepository) {}

  async execute(
    employee_id: string,
    request: ChangePasswordDTO,
  ): Promise<void> {
    const employee = await this.employeesRepository.findById(employee_id);

    if (
      !employee ||
      !(await validatePassword(request.current_password, employee.password))
    ) {
      throw new BadRequestException('Current password is wrong.');
    }

    await this.employeesRepository.update(employee.id, {
      password: request.new_password,
    });
  }
}
