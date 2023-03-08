import { Controller, UnauthorizedException } from '@nestjs/common';
import { Body, Get, Param, Post, Put } from '@nestjs/common/decorators';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Request } from '@nestjs/common/decorators/http/route-params.decorator';
import { Client, Office } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateOfficeDTO,
    @Request() request,
  ): Promise<BaseResponse> {
    if (request.user.office_id !== id) {
      throw new UnauthorizedException();
    }

    await this.editOffice.execute(id, data);
    return { success: true, message: 'Office edited.' };
  }
}
