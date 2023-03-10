import { BadRequestException, Injectable } from '@nestjs/common';
import { decodeBase64 } from 'src/app/common/utils/base64';
import { StorageService } from 'src/providers/storage/storage';
import { UpdateOfficeDTO } from '../dtos/update-office-dto';
import { OfficesRepository } from '../office.repository';
import { v4 as uuid } from 'uuid';

@Injectable()
export class EditOfficeUsecase {
  constructor(
    private officesRepository: OfficesRepository,
    private storageService: StorageService,
  ) {}

  async execute(office_id: string, request: UpdateOfficeDTO): Promise<void> {
    const office = await this.officesRepository.findById(office_id);

    if (!office) {
      throw new BadRequestException('Office not found.');
    }

    if (request.logo) {
      const logoFile = decodeBase64(request.logo);
      const logoFilepath = `offices/${uuid()}_logo_${request.name}.png`;

      const logoStoragePath = await this.storageService.uploadFile(
        logoFile,
        logoFilepath,
      );

      request.logo = logoStoragePath;
    }

    await this.officesRepository.update(office_id, request);
  }
}
