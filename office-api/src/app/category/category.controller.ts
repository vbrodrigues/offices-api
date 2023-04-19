import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import {
  Param,
  Request,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { Category } from '@prisma/client';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { CreateCategoryUsecase } from './usecases/create-category.usecase';
import { ListCategoriesUsecase } from './usecases/list-categories.usecase';
import { JwtAuthGuard } from 'src/auth/employee/jwt-auth.guard';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { RemoveCategoryUsecase } from './usecases/remove-category.usecase';
import { BaseResponse } from '../common/dtos/responses';

@Controller('/categories')
export class CategoryController {
  constructor(
    private createCategory: CreateCategoryUsecase,
    private listCategories: ListCategoriesUsecase,
    private removeCategory: RemoveCategoryUsecase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() { user: { office_id } }: OfficeRequest,
    @Body() data: CreateCategoryDTO,
  ): Promise<Category> {
    return await this.createCategory.execute(data, office_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async show(
    @Request() { user: { office_id } }: OfficeRequest,
  ): Promise<Category[]> {
    return await this.listCategories.execute(office_id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:category_id')
  async remove(
    @Request() { user: { office_id } }: OfficeRequest,
    @Param('category_id') category_id: string,
  ): Promise<BaseResponse> {
    await this.removeCategory.execute(office_id, category_id);
    return { success: true, message: 'Category deleted successfully.' };
  }
}
