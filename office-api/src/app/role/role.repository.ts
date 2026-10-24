import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';

export type RoleWithCount = Role & { _count: { employees: number } };

export abstract class RolesRepository {
  abstract add(office_id: string, label: string): Promise<Role>;
  abstract addMany(office_id: string, labels: string[]): Promise<void>;
  abstract findById(role_id: string): Promise<Role | null>;
  abstract findByLabel(office_id: string, label: string): Promise<Role | null>;
  // The office's roles with how many employees hold each
  abstract listByOffice(office_id: string): Promise<RoleWithCount[]>;
  abstract rename(role_id: string, label: string): Promise<void>;
  // Employees holding it are left without a role (FK ON DELETE SET NULL)
  abstract delete(role_id: string): Promise<void>;
}

@Injectable()
export class RolesRepositorySQL implements RolesRepository {
  constructor(private prisma: PrismaService) {}

  async add(office_id: string, label: string): Promise<Role> {
    return await this.prisma.role.create({ data: { office_id, label } });
  }

  async addMany(office_id: string, labels: string[]): Promise<void> {
    await this.prisma.role.createMany({
      data: labels.map((label) => ({ office_id, label })),
      skipDuplicates: true,
    });
  }

  async findById(role_id: string): Promise<Role | null> {
    return await this.prisma.role.findUnique({ where: { id: role_id } });
  }

  async findByLabel(office_id: string, label: string): Promise<Role | null> {
    return await this.prisma.role.findFirst({ where: { office_id, label } });
  }

  async listByOffice(office_id: string): Promise<RoleWithCount[]> {
    return await this.prisma.role.findMany({
      where: { office_id },
      include: { _count: { select: { employees: true } } },
      orderBy: { label: 'asc' },
    });
  }

  async rename(role_id: string, label: string): Promise<void> {
    await this.prisma.role.update({ where: { id: role_id }, data: { label } });
  }

  async delete(role_id: string): Promise<void> {
    await this.prisma.role.delete({ where: { id: role_id } });
  }
}
