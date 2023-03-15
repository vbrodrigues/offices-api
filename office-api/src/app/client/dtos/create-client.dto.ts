import { IsNotEmpty } from 'class-validator';

export class CreateClientDTO {
  @IsNotEmpty()
  office_id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  phone_number: string;

  avatar?: string | null;
}
