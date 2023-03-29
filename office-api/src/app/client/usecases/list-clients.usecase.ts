import { Injectable } from '@nestjs/common';
import { Client } from '@prisma/client';
import { StorageService } from 'src/providers/storage/storage';
import { ClientsRepository } from '../client.repository';

@Injectable()
export class ListClientsUsecase {
  constructor(
    private clientsRepository: ClientsRepository,
    private storageService: StorageService,
  ) {}

  async execute(office_id: string): Promise<Client[]> {
    const clients = await this.clientsRepository.listByOfficeId(office_id);

    const signedClients = Promise.all(
      clients.map(async (client) => {
        return {
          ...client,
          logo: client.logo
            ? await this.storageService.signFile(client.logo)
            : client.logo,
        };
      }),
    );

    return signedClients;
  }
}
