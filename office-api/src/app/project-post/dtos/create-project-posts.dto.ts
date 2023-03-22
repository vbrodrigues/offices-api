import { IsNotEmpty } from 'class-validator';

export class CreateProjectPostDTO {
  @IsNotEmpty()
  project_id: string;

  @IsNotEmpty()
  employee_id: string;

  @IsNotEmpty()
  office_id: string;

  content: string;
  encoded_media: string;
}
