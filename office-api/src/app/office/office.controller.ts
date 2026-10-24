import { Controller } from '@nestjs/common';
import { Body, Get, Param, Post, Put } from '@nestjs/common/decorators';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Office } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/employee/jwt-auth.guard';
import { Permission } from 'src/auth/employee/permissions';
import {
  PermissionsGuard,
  RequirePermission,
} from 'src/auth/employee/permissions.guard';
import { BaseResponse } from '../common/dtos/responses';
import { CreateOfficeDTO } from './dtos/create-office.dto';
import { UpdateOfficeDTO } from './dtos/update-office.dto';
import { CreateOfficeUsecase } from './usecases/create-office.usecase';
import { EditOfficeUsecase } from './usecases/edit-office.usecase';
import { FindOfficeUsecase } from './usecases/find-office.usecase';

@Controller('/offices')
export class OfficeController {
  constructor(
    private createOffice: CreateOfficeUsecase,
    private findOffice: FindOfficeUsecase,
    private editOffice: EditOfficeUsecase,
  ) {}

  @Post()
  async create(@Body() request: CreateOfficeDTO): Promise<Office> {
    const office = await this.createOffice.execute({
      ...request,
    });
    return office;
  }

  // JwtStrategy rejects an office_id param other than the caller's
  @UseGuards(JwtAuthGuard)
  @Get(':office_id')
  async index(@Param('office_id') office_id: string): Promise<Office | null> {
    return await this.findOffice.execute(office_id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission(Permission.MANAGE_OFFICE)
  @Put(':office_id')
  async update(
    @Param('office_id') office_id: string,
    @Body() data: UpdateOfficeDTO,
  ): Promise<BaseResponse> {
    await this.editOffice.execute(office_id, data);
    return { success: true, message: 'Office edited.' };
  }
}
