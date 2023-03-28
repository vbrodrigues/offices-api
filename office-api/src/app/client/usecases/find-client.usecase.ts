import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Client } from '@prisma/client';
import { StorageService } from 'src/providers/storage/storage';
import { ClientsRepository } from '../client.repository';

@Injectable()
export class FindClientUsecase {
  constructor(
    private clientsRepository: ClientsRepository,
    private storageService: StorageService,
  ) {}

  async execute(office_id, client_id: string): Promise<Client | null> {
    const client = await this.clientsRepository.findById(client_id);

    if (!client) {
      throw new UnauthorizedException();
    }

    if (office_id !== client.office_id) {
      throw new UnauthorizedException();
    }

    client.logo = await this.storageService.signFile(client.logo);

    return client;
  }
}
