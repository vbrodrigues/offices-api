import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Employee } from '@prisma/client';
import { decodeBase64 } from 'src/app/common/utils/base64';
import { StorageService } from 'src/providers/storage/storage';
import { CreateEmployeeDTO } from '../dtos/create-employee-dto';
import { EmployeesRepository } from '../employee.repository';
import { v4 as uuid } from 'uuid';
import { OfficesRepository } from 'src/app/office/office.repository';

@Injectable()
export class CreateEmployeeUsecase {
  constructor(
    private employeesRepository: EmployeesRepository,
    private officesRepository: OfficesRepository,
    private storageService: StorageService,
  ) {}

  async execute(
    office_id: string,
    request: CreateEmployeeDTO,
  ): Promise<Employee> {
    if (office_id !== request.office_id) {
      throw new UnauthorizedException();
    }

    const office = await this.officesRepository.findById(request.office_id);

    if (!office) {
      throw new UnauthorizedException();
    }

    const alreadyExists = await this.employeesRepository.findByEmail(
      request.email,
      request.office_id,
    );

    if (alreadyExists) {
      throw new BadRequestException('Employee already exists.');
    }

    const employee = await this.employeesRepository.add({
      ...request,
      avatar: null,
    });

    if (request.avatar) {
      const logoFile = decodeBase64(request.avatar);
      const logoFilepath = `offices/${request.office_id}/employees/${employee.id}/avatar/avatar.png`;

      const logoStoragePath = await this.storageService.uploadFile(
        logoFile,
        logoFilepath,
      );

      await this.employeesRepository.update(employee.id, {
        avatar: logoStoragePath,
      });
      employee.avatar = logoStoragePath;
    }

    return employee;
  }
}
