import { Controller } from '@nestjs/common';
import { Body, Get, Param, Post, Put } from '@nestjs/common/decorators';
import { Client, Office } from '@prisma/client';
import { BaseResponse } from '../common/dtos/responses';
import { CreateOfficeDTO } from './dtos/create-office-dto';
import { UpdateOfficeDTO } from './dtos/update-office-dto';
import { CreateOfficeUsecase } from './usecases/create-office.usecase';
import { EditOfficeUsecase } from './usecases/edit-office.usecase';
import { FindOfficeUsecase } from './usecases/find-office.usecase';
import { ListOfficeClientsUsecase } from './usecases/list-office-clients';

@Controller('/offices')
export class OfficeController {
  constructor(
    private createOffice: CreateOfficeUsecase,
    private findOffice: FindOfficeUsecase,
    private listOfficeClients: ListOfficeClientsUsecase,
    private editOffice: EditOfficeUsecase,
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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() request: UpdateOfficeDTO,
  ): Promise<BaseResponse> {
    await this.editOffice.execute(id, request);
    return { success: true, message: 'Office edited.' };
  }
}
