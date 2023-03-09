import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Client } from '@prisma/client';
import { CreateClientDTO } from './dtos/create-client.dto';
import { CreateClientUsecase } from './usecases/create-client.usecase';
import { FindClientUsecase } from './usecases/find-client.usecase';
import { Request } from '@nestjs/common/decorators/http/route-params.decorator';
import { ListClientsUsecase } from './usecases/list-clients.usecase';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EditClientUsecase } from './usecases/edit-client.usecase';
import { UpdateClientDTO } from './dtos/update-client.dto';

@Controller('/clients')
export class ClientController {
  constructor(
    private createClient: CreateClientUsecase,
    private findClient: FindClientUsecase,
    private listClients: ListClientsUsecase,
    private editClient: EditClientUsecase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() request: CreateClientDTO): Promise<Client> {
    return await this.createClient.execute(request);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':client_id')
  async index(@Param('client_id') client_id: string): Promise<Client | null> {
    return await this.findClient.execute(client_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async show(@Request() request): Promise<Client[]> {
    return await this.listClients.execute(request.user.office_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':client_id')
  async update(
    @Param('client_id') client_id: string,
    @Body() data: UpdateClientDTO,
    @Request() request,
  ): Promise<void> {
    return await this.editClient.execute(
      client_id,
      request.user.office_id,
      data,
    );
  }
}
