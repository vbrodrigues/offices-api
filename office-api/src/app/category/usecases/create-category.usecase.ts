import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { CreateCategoryDTO } from '../dtos/create-category.dto';
import { CategoriesRepository } from '../category.repository';

@Injectable()
export class CreateCategoryUsecase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute(
    request: CreateCategoryDTO,
    office_id: string,
  ): Promise<Category> {
    if (request.office_id !== office_id) {
      throw new UnauthorizedException();
    }

    const alreadyExists = await this.categoriesRepository.findByName(
      request.name,
      request.office_id,
    );

    if (alreadyExists) {
      throw new BadRequestException('Category already exists.');
    }

    return await this.categoriesRepository.add(request);
  }
}
