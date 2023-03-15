import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { decodeBase64 } from 'src/app/common/utils/base64';
import { StorageService } from 'src/providers/storage/storage';
import { UpdateEmployeeDTO } from '../dtos/update-employee.dto';
import { EmployeesRepository } from '../employee.repository';
import { v4 as uuid } from 'uuid';

@Injectable()
export class EditEmployeeUsecase {
  constructor(
    private employeesRepository: EmployeesRepository,
    private storageService: StorageService,
  ) {}

  async execute(
    employee_id: string,
    office_id: string,
    request: UpdateEmployeeDTO,
  ): Promise<void> {
    const employee = await this.employeesRepository.findById(employee_id);

    if (!employee) {
      throw new BadRequestException('Employee not found.');
    }

    if (employee.office_id !== office_id) {
      throw new UnauthorizedException();
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

    await this.employeesRepository.update(employee_id, request);
  }
}
