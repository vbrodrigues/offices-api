import { Injectable } from '@nestjs/common';
import { Office } from '@prisma/client';
import { StorageService } from 'src/providers/storage/storage';
import { OfficesRepository } from '../office.repository';

@Injectable()
export class FindOfficeUsecase {
  constructor(
    private officesRepository: OfficesRepository,
    private storageService: StorageService,
  ) {}

  async execute(office_id: string): Promise<Office | null> {
    const office = await this.officesRepository.findById(office_id);

    if (office.logo) {
      office.logo = await this.storageService.signFile(office.logo);
    }

    return office;
  }
}
