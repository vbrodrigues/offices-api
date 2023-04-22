import { Injectable } from '@nestjs/common';
import { Step } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import { CreateStepInternalDTO } from './dtos/create-step.dto';

export abstract class StepsRepository {
  abstract add(data: CreateStepInternalDTO): Promise<Step>;
  abstract delete(step_id: string): Promise<void>;
  abstract findByName(name: string): Promise<Step | null>;
  abstract findById(step_id: string): Promise<Step | null>;
  abstract listSteps(office_id: string): Promise<Step[]>;
}

@Injectable()
export class StepsRepositorySQL implements StepsRepository {
  constructor(private prisma: PrismaService) {}

  async add(data: CreateStepInternalDTO): Promise<Step> {
    return await this.prisma.step.create({ data: data });
  }

  async delete(step_id: string): Promise<void> {
    console.log(step_id);
    await this.prisma.step.delete({ where: { id: step_id } });
  }

  async findByName(name: string): Promise<Step | null> {
    return await this.prisma.step.findFirst({ where: { name: name } });
  }

  async findById(step_id: string): Promise<Step> {
    return await this.prisma.step.findFirst({ where: { id: step_id } });
  }

  async listSteps(office_id: string): Promise<Step[]> {
    return await this.prisma.step.findMany({ where: { office_id: office_id } });
  }
}
