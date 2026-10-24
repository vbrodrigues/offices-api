import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { AccessLevel, Office } from '@prisma/client';
import { OfficesRepository } from '../office.repository';
import { CreateOfficeDTO } from '../dtos/create-office.dto';
import { EmployeesRepository } from 'src/app/employee/employee.repository';
import { RolesRepository } from 'src/app/role/role.repository';
import { StorageService } from 'src/providers/storage/storage';
import { decodeBase64 } from 'src/app/common/utils/base64';
import {
  DEFAULT_ROLE_LABELS,
  OWNER_ROLE_LABEL,
} from 'src/app/role/dtos/create-role-dto';

@Injectable()
export class CreateOfficeUsecase {
  constructor(
    private officesRepository: OfficesRepository,
    private employeesRepository: EmployeesRepository,
    private rolesRepository: RolesRepository,
    private storageService: StorageService,
  ) {}

  async execute(request: CreateOfficeDTO): Promise<Office> {
    const alreadyExists = await this.officesRepository.findByName(request.name);
    const { owner_password, owner_name } = request;
    delete request.owner_password;
    delete request.owner_name;

    if (alreadyExists) {
      throw new BadRequestException('Office already exists');
    }

    const office = await this.officesRepository.add({ ...request, logo: null });

    if (request.logo) {
      const logoFile = decodeBase64(request.logo);
      const logoFilepath = `offices/${office.id}/brand/logo.png`;

      const logoStoragePath = await this.storageService.uploadFile(
        logoFile,
        logoFilepath,
      );

      await this.officesRepository.update(office.id, { logo: logoStoragePath });
    }

    await this.rolesRepository.addMany(office.id, DEFAULT_ROLE_LABELS);
    const role = await this.rolesRepository.findByLabel(
      office.id,
      OWNER_ROLE_LABEL,
    );

    await this.employeesRepository.add({
      email: request.owner_email,
      name: owner_name?.trim() || request.name,
      password: owner_password,
      phone_number: request.owner_phone_number,
      office_id: office.id,
      role_id: role?.id ?? null,
      access_level: AccessLevel.OWNER,
    });

    delete office.logo;

    return office;
  }
}
