import { IsNotEmpty } from 'class-validator';

export class CreateProjectTypeDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  office_id: string;
}
