import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { StorageModule } from 'src/providers/storage/storage.module';
import { CategoryController } from './category.controller';
import { CreateCategoryUsecase } from './usecases/create-category.usecase';
import { ListCategoriesUsecase } from './usecases/list-categories.usecase';
import { RemoveCategoryUsecase } from './usecases/remove-category.usecase';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [CategoryController],
  providers: [
    CreateCategoryUsecase,
    ListCategoriesUsecase,
    RemoveCategoryUsecase,
  ],
})
export class CategoryModule {}
