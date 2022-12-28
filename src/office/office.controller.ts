import { Controller } from '@nestjs/common';
import { Body, Get, Param, Post } from '@nestjs/common/decorators';
import { Office } from '@prisma/client';
import { CreateOfficeDTO } from './dtos/create-office-dto';
import { CreateOfficeUsecase } from './usecases/create-office-usecase';
import { FindOfficeUsecase } from './usecases/find-office-usecase';

@Controller('/offices')
export class OfficeController {
  constructor(
    private createOffice: CreateOfficeUsecase,
    private findOffice: FindOfficeUsecase,
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
}
