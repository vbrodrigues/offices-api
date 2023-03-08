import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateOfficeDTO } from '../dtos/update-office-dto';
import { OfficesRepository } from '../office.repository';

@Injectable()
export class EditOfficeUsecase {
  constructor(private officesRepository: OfficesRepository) {}

  async execute(office_id: string, data: UpdateOfficeDTO): Promise<void> {
    const office = await this.officesRepository.findById(office_id);

    if (!office) {
      throw new BadRequestException('Office not found.');
    }

    await this.officesRepository.update(office_id, data);
  }
}
