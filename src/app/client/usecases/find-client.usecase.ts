import { Injectable } from '@nestjs/common';
import { Client } from '@prisma/client';
import { ClientsRepository } from '../client.repository';

@Injectable()
export class FindClientUsecase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute(client_id: string): Promise<Client | null> {
    return await this.clientsRepository.findById(client_id);
  }
}
