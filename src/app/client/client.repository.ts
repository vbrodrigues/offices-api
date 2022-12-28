import { Injectable } from '@nestjs/common';
import { Client } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import { CreateClientDTO } from './dtos/create-client.dto';
import { FindByEmailAndOfficeIdDTO } from './dtos/find-by-email-and-office-id.dto';

export abstract class ClientsRepository {
  abstract add(data: CreateClientDTO): Promise<Client>;
  abstract findByEmailAndOfficeId(
    data: FindByEmailAndOfficeIdDTO,
  ): Promise<Client | null>;
  abstract findById(client_id: string): Promise<Client | null>;
  abstract listByOfficeId(office_id: string): Promise<Client[]>;
}

@Injectable()
export class ClientsRepositorySQL implements ClientsRepository {
  constructor(private prisma: PrismaService) {}

  async add(data: CreateClientDTO): Promise<Client> {
    const client = await this.prisma.client.create({ data: data });
    return client;
  }

  async findByEmailAndOfficeId(
    data: FindByEmailAndOfficeIdDTO,
  ): Promise<Client | null> {
    const client = await this.prisma.client.findFirst({
      where: { email: data.email, office_id: data.office_id },
    });
    return client;
  }

  async findById(client_id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { id: client_id },
    });
    return client;
  }

  async listByOfficeId(office_id: string): Promise<Client[]> {
    return await this.prisma.client.findMany({ where: { office_id } });
  }
}
