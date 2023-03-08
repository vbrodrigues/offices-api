import { IsNotEmpty } from 'class-validator';

export class CreateEmployeeDTO {
  @IsNotEmpty()
  office_id: string;

  @IsNotEmpty()
  role_id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  phone_number?: string | null;
}
