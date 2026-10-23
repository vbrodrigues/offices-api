import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { decodeBase64 } from 'src/app/common/utils/base64';
import { StorageService } from 'src/providers/storage/storage';
import { ClientsRepository } from '../client.repository';
import { UpdateClientDTO } from '../dtos/update-client.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class EditClientUsecase {
  constructor(
    private clientsRepository: ClientsRepository,
    private storageService: StorageService,
  ) {}

  async execute(
    client_id: string,
    office_id: string,
    request: UpdateClientDTO,
  ): Promise<void> {
    const client = await this.clientsRepository.findById(client_id);

    if (!client) {
      throw new BadRequestException('Client not found.');
    }

    if (client.office_id !== office_id) {
      throw new UnauthorizedException();
    }

    if (request.email && request.email !== client.email) {
      const alreadyExists = await this.clientsRepository.findByEmailAndOfficeId(
        { email: request.email, office_id },
      );

      if (alreadyExists) {
        throw new BadRequestException('Client already exists.');
      }
    }

    // The global ValidationPipe doesn't whitelist, so only pass known fields
    // (never password or office_id) to the repository.
    const { name, email, phone_number, is_active } = request;
    const data: UpdateClientDTO = { name, email, phone_number, is_active };

    if (request.logo) {
      const logoFile = decodeBase64(request.logo);
      const logoFilepath = `clients/${uuid()}.png`;

      const logoStoragePath = await this.storageService.uploadFile(
        logoFile,
        logoFilepath,
      );

      data.logo = logoStoragePath;
    }

    await this.clientsRepository.update(client_id, data);
  }
}
