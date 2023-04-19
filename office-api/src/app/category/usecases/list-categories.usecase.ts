import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { CategoriesRepository } from '../category.repository';

@Injectable()
export class ListCategoriesUsecase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute(office_id: string): Promise<Category[]> {
    return await this.categoriesRepository.list(office_id);
  }
}
