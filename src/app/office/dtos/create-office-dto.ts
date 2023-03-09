import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateOfficeDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  owner_email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  owner_password: string;

  owner_phone_number?: string | null;
  logo?: string | null;
}
