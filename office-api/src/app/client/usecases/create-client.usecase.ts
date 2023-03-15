import { BadRequestException, Injectable } from '@nestjs/common';
import { Client } from '@prisma/client';
import { OfficesRepository } from 'src/app/office/office.repository';
import { StorageService } from 'src/providers/storage/storage';
import { ClientsRepository } from '../client.repository';
import { CreateClientDTO } from '../dtos/create-client.dto';
import { v4 as uuid } from 'uuid';
import { decodeBase64 } from 'src/app/common/utils/base64';
import { NotificationsService } from 'src/events/notifications.service';

@Injectable()
export class CreateClientUsecase {
  constructor(
    private officesRepository: OfficesRepository,
    private clientsRepository: ClientsRepository,
    private storageService: StorageService,
    private notificationsService: NotificationsService,
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

    if (request.avatar) {
      const logoFile = decodeBase64(request.avatar);
      const logoFilepath = `clients/${uuid()}.png`;

      const logoStoragePath = await this.storageService.uploadFile(
        logoFile,
        logoFilepath,
      );

      request.avatar = logoStoragePath;
    }

    const client = await this.clientsRepository.add(request);

    this.notificationsService.notify({ type: 'CLIENT_CREATED', data: client });

    return client;
  }
}
