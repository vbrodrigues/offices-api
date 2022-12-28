import { Injectable } from '@nestjs/common';
import { Office } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import { CreateOfficeDTO } from './dtos/create-office-dto';

export abstract class OfficesRepository {
  abstract add(data: CreateOfficeDTO): Promise<Office>;
  abstract findByName(name: string): Promise<Office | null>;
  abstract findById(office_id: string): Promise<Office | null>;
}

@Injectable()
export class OfficesRepositorySQL implements OfficesRepository {
  constructor(private prisma: PrismaService) {}

  async add(data: CreateOfficeDTO): Promise<Office> {
    const office = await this.prisma.office.create({ data: data });
    return office;
  }

  async findByName(name: string): Promise<Office | null> {
    const office = await this.prisma.office.findFirst({ where: { name } });
    return office;
  }

  async findById(office_id: string): Promise<Office | null> {
    return await this.prisma.office.findUnique({ where: { id: office_id } });
  }
}
