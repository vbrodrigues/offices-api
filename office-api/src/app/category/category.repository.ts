import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/database/prisma-service';
import { CreateCategoryDTO } from './dtos/create-category.dto';

export abstract class CategoriesRepository {
  abstract findByName(
    name: string,
    office_id: string,
  ): Promise<Category | null>;
  abstract findById(category_id: string): Promise<Category | null>;
  abstract add(data: CreateCategoryDTO): Promise<Category>;
  abstract list(office_id: string): Promise<Category[]>;
  abstract delete(category_id: string): Promise<void>;
}

@Injectable()
export class CategoriesRepositorySQL implements CategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async findByName(name: string, office_id: string): Promise<Category> {
    return await this.prisma.category.findFirst({
      where: { name, office_id },
    });
  }

  async findById(category_id: string): Promise<Category> {
    return await this.prisma.category.findUnique({
      where: { id: category_id },
    });
  }

  async add(data: CreateCategoryDTO): Promise<Category> {
    return await this.prisma.category.create({ data });
  }

  async list(office_id: string): Promise<Category[]> {
    return await this.prisma.category.findMany({ where: { office_id } });
  }

  async delete(category_id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id: category_id } });
  }
}
