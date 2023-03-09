import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientsRepository } from '../client.repository';
import { UpdateClientDTO } from '../dtos/update-client.dto';

@Injectable()
export class EditClientUsecase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute(
    client_id: string,
    office_id: string,
    data: UpdateClientDTO,
  ): Promise<void> {
    const client = await this.clientsRepository.findById(client_id);

    if (!client) {
      throw new BadRequestException('Client not found.');
    }

    if (client.office_id !== office_id) {
      throw new UnauthorizedException();
    }

    await this.clientsRepository.update(client_id, data);
  }
}
