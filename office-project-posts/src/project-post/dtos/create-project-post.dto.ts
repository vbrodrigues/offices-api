import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProjectPostDTO {
  @IsNotEmpty()
  project_id: string;

  @IsNotEmpty()
  employee_id: string;

  @IsNotEmpty()
  office_id: string;

  @IsNotEmpty()
  client_id: string;

  content: string;
  encoded_media: string;
  encoded_media_format: string;
}

export class CreateProjectPostInternalDTO {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  project_id: string;

  @IsNotEmpty()
  employee_id: string;

  @IsNotEmpty()
  office_id: string;

  content: string;
  media_path: string;
  likes: number;
  created_at: Date;
}
