import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import { CreateRoleDTO } from './dtos/create-role-dto';

export abstract class RolesRepository {
  abstract add(data: CreateRoleDTO): Promise<Role>;
  abstract findByLabel(label: string): Promise<Role | null>;
}

@Injectable()
export class RolesRepositorySQL implements RolesRepository {
  constructor(private prisma: PrismaService) {}

  async add(data: CreateRoleDTO): Promise<Role> {
    const role = await this.prisma.role.create({ data: data });
    return role;
  }

  async findByLabel(label: string): Promise<Role> {
    return await this.prisma.role.findFirst({ where: { label: label } });
  }
}
