import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  office_id: string;
}
