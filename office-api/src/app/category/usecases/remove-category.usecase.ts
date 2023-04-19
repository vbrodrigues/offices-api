import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CategoriesRepository } from '../category.repository';

@Injectable()
export class RemoveCategoryUsecase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute(office_id: string, category_id: string): Promise<void> {
    const category = await this.categoriesRepository.findById(category_id);

    if (!category) {
      throw new UnauthorizedException();
    }

    if (office_id !== category.office_id) {
      throw new UnauthorizedException();
    }

    await this.categoriesRepository.delete(category_id);
  }
}
