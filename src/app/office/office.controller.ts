import { Controller } from '@nestjs/common';
import { Body, Get, Param, Post } from '@nestjs/common/decorators';
import { Client, Office } from '@prisma/client';
import { CreateOfficeDTO } from './dtos/create-office-dto';
import { CreateOfficeUsecase } from './usecases/create-office.usecase';
import { FindOfficeUsecase } from './usecases/find-office.usecase';
import { ListOfficeClientsUsecase } from './usecases/list-office-clients';

@Controller('/offices')
export class OfficeController {
  constructor(
    private createOffice: CreateOfficeUsecase,
    private findOffice: FindOfficeUsecase,
    private listOfficeClients: ListOfficeClientsUsecase,
  ) {}

  @Post()
  async create(@Body() request: CreateOfficeDTO): Promise<Office> {
    const office = await this.createOffice.execute(request);
    return office;
  }

  @Get(':id')
  async index(@Param('id') id: string): Promise<Office | null> {
    return await this.findOffice.execute(id);
  }

  @Get(':id/clients')
  async listClients(@Param('id') id: string): Promise<Client[]> {
    return await this.listOfficeClients.execute(id);
  }
}
