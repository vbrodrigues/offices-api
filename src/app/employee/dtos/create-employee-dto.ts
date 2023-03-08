import { IsNotEmpty, Length } from 'class-validator';

export class CreateEmployeeDTO {
  @IsNotEmpty()
  office_id: string;

  @IsNotEmpty()
  role_id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Length(6)
  password: string;

  phone_number?: string | null;
}
