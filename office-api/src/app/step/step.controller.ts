import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateStepUsecase } from './usecases/create-step.usecase';
import { JwtAuthGuard } from 'src/auth/employee/jwt-auth.guard';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { CreateStepDTO } from './dtos/create-step.dto';
import { Step } from '@prisma/client';

@Controller('/steps')
export class StepController {
  constructor(private createStep: CreateStepUsecase) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() { user: { office_id } }: OfficeRequest,
    @Body() request: CreateStepDTO,
  ): Promise<Step> {
    return await this.createStep.execute(office_id, request);
  }
}
