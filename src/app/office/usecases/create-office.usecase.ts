import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { Office } from '@prisma/client';
import { OfficesRepository } from '../office.repository';
import { CreateOfficeDTO } from '../dtos/create-office-dto';
import { EmployeesRepository } from 'src/app/employee/employee.repository';
import { RolesRepository } from 'src/app/role/role.repository';
import { StorageService } from 'src/providers/storage/storage';
import { decodeBase64 } from 'src/app/common/utils/base64';
import { v4 as uuid } from 'uuid';

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
    const { owner_password } = request;
    delete request.owner_password;

    if (alreadyExists) {
      throw new BadRequestException('Office already exists');
    }

    const logoFile = decodeBase64(request.logo);
    const logoFilepath = `offices/${uuid()}_logo_${request.name}.png`;

    const logoStoragePath = await this.storageService.uploadFile(
      logoFile,
      logoFilepath,
    );

    request.logo = logoStoragePath;

    const role = await this.rolesRepository.findByLabel('owner');

    const office = await this.officesRepository.add(request);

    await this.employeesRepository.add({
      email: request.owner_email,
      name: request.name,
      password: owner_password,
      phone_number: request.owner_phone_number,
      office_id: office.id,
      role_id: role.id,
    });

    return office;
  }
}
