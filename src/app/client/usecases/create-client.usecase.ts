import { BadRequestException, Injectable } from '@nestjs/common';
import { Client } from '@prisma/client';
import { OfficesRepository } from 'src/app/office/office.repository';
import { ClientsRepository } from '../client.repository';
import { CreateClientDTO } from '../dtos/create-client.dto';

@Injectable()
export class CreateClientUsecase {
  constructor(
    private officesRepository: OfficesRepository,
    private clientsRepository: ClientsRepository,
  ) {}

  async execute(request: CreateClientDTO): Promise<Client> {
    const office = await this.officesRepository.findById(request.office_id);

    if (!office) {
      throw new BadRequestException('Office not found.');
    }

    const alreadyExists = await this.clientsRepository.findByEmailAndOfficeId({
      email: request.email,
      office_id: request.office_id,
    });

    if (alreadyExists) {
      throw new BadRequestException('Client already exists.');
    }

    return await this.clientsRepository.add(request);
  }
}
