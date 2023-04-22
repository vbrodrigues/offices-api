import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateStepUsecase } from './usecases/create-step.usecase';
import { JwtAuthGuard } from 'src/auth/employee/jwt-auth.guard';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { CreateStepDTO } from './dtos/create-step.dto';
import { Step } from '@prisma/client';
import { ListStepsUsecase } from './usecases/list-steps.usecase';
import { RemoveStepUsecase } from './usecases/remove-step.usecase';
import { BaseResponse } from '../common/dtos/responses';

@Controller('/steps')
export class StepController {
  constructor(
    private createStep: CreateStepUsecase,
    private listSteps: ListStepsUsecase,
    private removeStep: RemoveStepUsecase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() { user: { office_id } }: OfficeRequest,
    @Body() request: CreateStepDTO,
  ): Promise<Step> {
    return await this.createStep.execute(office_id, request);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async show(
    @Request() { user: { office_id } }: OfficeRequest,
  ): Promise<Step[]> {
    return await this.listSteps.execute(office_id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:step_id')
  async delete(
    @Request() { user: { office_id } }: OfficeRequest,
    @Param() { step_id }: { step_id: string },
  ): Promise<BaseResponse> {
    await this.removeStep.execute(office_id, step_id);
    return { success: true, message: 'Successfully removed step.' };
  }
}
