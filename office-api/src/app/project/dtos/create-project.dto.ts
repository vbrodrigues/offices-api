import { IsNotEmpty } from 'class-validator';

export class CreateProjectDTO {
  @IsNotEmpty()
  client_id: string;

  @IsNotEmpty()
  project_type_id: string;

  @IsNotEmpty()
  name: string;
}
