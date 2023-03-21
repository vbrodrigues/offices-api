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

    if (request.logo) {
      const logoFile = decodeBase64(request.logo);
      const logoFilepath = `clients/${uuid()}.png`;

      const logoStoragePath = await this.storageService.uploadFile(
        logoFile,
        logoFilepath,
      );

      request.logo = logoStoragePath;
    }

    await this.clientsRepository.update(client_id, request);
  }
}
