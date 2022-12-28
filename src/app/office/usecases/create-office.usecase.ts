import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { Office } from '@prisma/client';
import { OfficesRepository } from '../office.repository';
import { CreateOfficeDTO } from '../dtos/create-office-dto';

@Injectable()
export class CreateOfficeUsecase {
  constructor(private officesRepository: OfficesRepository) {}

  async execute(request: CreateOfficeDTO): Promise<Office> {
    const alreadyExists = await this.officesRepository.findByName(request.name);

    if (alreadyExists) {
      throw new BadRequestException('Office already exists');
    }

    return await this.officesRepository.add(request);
  }
}
