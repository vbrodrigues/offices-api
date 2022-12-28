import { IsNotEmpty } from 'class-validator';

export class CreateOfficeDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  owner_email: string;

  owner_phone_number?: string | null;
  logo?: string | null;
}
