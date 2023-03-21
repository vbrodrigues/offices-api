import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateClientDTO {
  @IsNotEmpty()
  office_id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  phone_number: string;

  logo?: string | null;
}
