import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AccessLevel, Employee } from '@prisma/client';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { StorageService } from 'src/providers/storage/storage';
import { CreateEmployeeDTO } from '../dtos/create-employee-dto';
import { EmployeesRepository } from '../employee.repository';
import { OfficesRepository } from 'src/app/office/office.repository';
import { RolesRepository } from 'src/app/role/role.repository';
import { assertCanGrant, assertRoleOfOffice } from '../employee-rules';
import { toPublicEmployee, uploadAvatar } from '../employee-view';

@Injectable()
export class CreateEmployeeUsecase {
  constructor(
    private employeesRepository: EmployeesRepository,
    private officesRepository: OfficesRepository,
    private rolesRepository: RolesRepository,
    private storageService: StorageService,
  ) {}

  async execute(
    caller: OfficeRequest['user'],
    request: CreateEmployeeDTO,
  ): Promise<Omit<Employee, 'password'>> {
    if (caller.office_id !== request.office_id) {
      throw new UnauthorizedException();
    }

    const office = await this.officesRepository.findById(request.office_id);

    if (!office) {
      throw new UnauthorizedException();
    }

    assertCanGrant(caller, request.access_level);
    await assertRoleOfOffice(this.rolesRepository, office.id, request.role_id);

    const alreadyExists = await this.employeesRepository.findByEmail(
      request.email,
      request.office_id,
    );

    if (alreadyExists) {
      throw new BadRequestException('Employee already exists.');
    }

    const employee = await this.employeesRepository.add({
      office_id: office.id,
      role_id: request.role_id || null,
      access_level: request.access_level ?? AccessLevel.MEMBER,
      name: request.name.trim(),
      email: request.email,
      password: request.password,
      phone_number: request.phone_number ?? null,
      avatar: null,
    });

    if (request.avatar) {
      employee.avatar = await uploadAvatar(
        this.storageService,
        employee,
        request.avatar,
      );
      await this.employeesRepository.update(employee.id, {
        avatar: employee.avatar,
      });
    }

    return await toPublicEmployee(employee, this.storageService);
  }
}
