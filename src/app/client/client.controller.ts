import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Client } from '@prisma/client';
import { CreateClientDTO } from './dtos/create-client.dto';
import { CreateClientUsecase } from './usecases/create-client.usecase';
import { FindClientUsecase } from './usecases/find-client.usecase';

@Controller('/clients')
export class ClientController {
  constructor(
    private createClient: CreateClientUsecase,
    private findClient: FindClientUsecase,
  ) {}

  @Post()
  async create(@Body() request: CreateClientDTO): Promise<Client> {
    return await this.createClient.execute(request);
  }

  @Get(':id')
  async index(@Param('id') id: string): Promise<Client | null> {
    return await this.findClient.execute(id);
  }
}
