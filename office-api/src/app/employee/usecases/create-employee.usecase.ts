import { BadRequestException, Injectable } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { decodeBase64 } from 'src/app/common/utils/base64';
import { StorageService } from 'src/providers/storage/storage';
import { CreateEmployeeDTO } from '../dtos/create-employee-dto';
import { EmployeesRepository } from '../employee.repository';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CreateEmployeeUsecase {
  constructor(
    private employeesRepository: EmployeesRepository,
    private storageService: StorageService,
  ) {}

  async execute(request: CreateEmployeeDTO): Promise<Employee> {
    const alreadyExists = await this.employeesRepository.findByEmail(
      request.email,
      request.office_id,
    );

    if (alreadyExists) {
      throw new BadRequestException('Employee already exists.');
    }

    if (request.avatar) {
      const logoFile = decodeBase64(request.avatar);
      const logoFilepath = `employees/${uuid()}.png`;

      const logoStoragePath = await this.storageService.uploadFile(
        logoFile,
        logoFilepath,
      );

      request.avatar = logoStoragePath;
    }

    return await this.employeesRepository.add(request);
  }
}
