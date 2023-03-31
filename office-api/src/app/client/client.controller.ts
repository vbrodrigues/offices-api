import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  Inject,
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
import { EditClientUsecase } from './usecases/edit-client.usecase';
import { UpdateClientDTO } from './dtos/update-client.dto';
import { BaseResponse } from '../common/dtos/responses';
import { InactivateClientUsecase } from './usecases/inactivate-client.usecase';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { JwtAuthGuard } from 'src/auth/employee/jwt-auth.guard';
import { Cache } from 'cache-manager';

@Controller('/clients')
export class ClientController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private createClient: CreateClientUsecase,
    private findClient: FindClientUsecase,
    private listClients: ListClientsUsecase,
    private editClient: EditClientUsecase,
    private inactivateClient: InactivateClientUsecase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() request: CreateClientDTO): Promise<Client> {
    return await this.createClient.execute(request);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':client_id')
  async index(
    @Request() { user: { office_id } }: OfficeRequest,
    @Param('client_id') client_id: string,
  ): Promise<Client | null> {
    return await this.findClient.execute(office_id, client_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async show(@Request() request): Promise<Client[]> {
    const cachedRespose: Client[] = await this.cacheManager.get('clients');

    if (cachedRespose) {
      return cachedRespose;
    }

    const clients = await this.listClients.execute(request.user.office_id);

    if (clients) {
      await this.cacheManager.set('clients', clients, 5000);
    }

    return clients;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':client_id')
  async update(
    @Param('client_id') client_id: string,
    @Body() data: UpdateClientDTO,
    @Request() request,
  ): Promise<BaseResponse> {
    await this.editClient.execute(client_id, request.user.office_id, data);
    return { success: true, message: 'Client edited.' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':client_id')
  async delete(
    @Param('client_id') client_id: string,
    @Request() request,
  ): Promise<BaseResponse> {
    await this.inactivateClient.execute(client_id, request.user.office_id);
    return { success: true, message: 'Client inactivated.' };
  }
}
