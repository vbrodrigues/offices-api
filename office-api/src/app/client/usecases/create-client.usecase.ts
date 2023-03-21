import { BadRequestException, Injectable } from '@nestjs/common';
import { Client } from '@prisma/client';
import { OfficesRepository } from 'src/app/office/office.repository';
import { StorageService } from 'src/providers/storage/storage';
import { ClientsRepository } from '../client.repository';
import { CreateClientDTO } from '../dtos/create-client.dto';
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

    const client = await this.clientsRepository.add({ ...request, logo: null });

    if (request.logo) {
      const logoFile = decodeBase64(request.logo);
      const logoFilepath = `offices/${office.id}/clients/${client.id}/brand/logo.png`;

      const logoStoragePath = await this.storageService.uploadFile(
        logoFile,
        logoFilepath,
      );

      await this.clientsRepository.update(client.id, {
        logo: logoStoragePath,
      });
    }

    try {
      this.notificationsService.notify({
        type: 'CLIENT_CREATED',
        data: client,
      });
    } catch (err) {
      console.log('Error notifying client creation.');
    }

    delete client.password;
    delete client.logo;

    return client;
  }
}
