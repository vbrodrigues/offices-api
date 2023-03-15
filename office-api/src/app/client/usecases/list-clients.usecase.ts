import { Injectable } from '@nestjs/common';
import { Client } from '@prisma/client';
import { ClientsRepository } from '../client.repository';

@Injectable()
export class ListClientsUsecase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute(office_id: string): Promise<Client[]> {
    return await this.clientsRepository.listByOfficeId(office_id);
  }
}
