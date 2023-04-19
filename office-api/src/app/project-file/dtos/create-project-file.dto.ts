import { IsNotEmpty } from 'class-validator';

export class CreateProjectFileDTO {
  @IsNotEmpty()
  project_id: string;

  @IsNotEmpty()
  category_id: string;

  @IsNotEmpty()
  created_by: string;

  @IsNotEmpty()
  file: string;

  @IsNotEmpty()
  fileFormat: string;

  name?: string;
}

export class CreateProjectFileInternalDTO {
  @IsNotEmpty()
  project_id: string;

  @IsNotEmpty()
  category_id: string;

  @IsNotEmpty()
  created_by_id: string;

  @IsNotEmpty()
  path: string;

  name?: string;
}
