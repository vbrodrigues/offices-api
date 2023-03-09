import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { ClientsRepository } from '../client.repository';

@Injectable()
export class InactivateClientUsecase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute(client_id: string, office_id: string): Promise<void> {
    const client = await this.clientsRepository.findById(client_id);

    if (!client) {
      throw new BadRequestException('Client not found.');
    }

    if (client.office_id !== office_id) {
      throw new UnauthorizedException();
    }

    if (!client.is_active) {
      throw new BadRequestException('Client already inactive.');
    }

    await this.clientsRepository.update(client_id, { is_active: false });
  }
}
