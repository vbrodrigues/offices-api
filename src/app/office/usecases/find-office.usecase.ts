import { Injectable } from '@nestjs/common';
import { Office } from '@prisma/client';
import { OfficesRepository } from '../office.repository';

@Injectable()
export class FindOfficeUsecase {
  constructor(private officesRepository: OfficesRepository) {}

  async execute(office_id: string): Promise<Office | null> {
    return await this.officesRepository.findById(office_id);
  }
}
