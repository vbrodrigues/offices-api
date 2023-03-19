import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Client } from '@prisma/client';
import { ClientsRepository } from '../client.repository';

@Injectable()
export class FindClientUsecase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute(office_id, client_id: string): Promise<Client | null> {
    const client = await this.clientsRepository.findById(client_id);

    if (!client) {
      throw new UnauthorizedException();
    }

    if (office_id !== client.office_id) {
      throw new UnauthorizedException();
    }

    return client;
  }
}
