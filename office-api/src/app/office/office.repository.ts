import { Injectable } from '@nestjs/common';
import { Office } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import { CreateOfficeDTO } from './dtos/create-office-dto';
import { UpdateOfficeDTO } from './dtos/update-office-dto';

export abstract class OfficesRepository {
  abstract add(data: CreateOfficeDTO): Promise<Office>;
  abstract findByName(name: string): Promise<Office | null>;
  abstract findById(office_id: string): Promise<Office | null>;
  abstract update(office_id: string, data: UpdateOfficeDTO): Promise<void>;
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

  async update(office_id: string, data: UpdateOfficeDTO): Promise<void> {
    await this.prisma.office.update({
      where: {
        id: office_id,
      },
      data: data,
    });
  }
}
