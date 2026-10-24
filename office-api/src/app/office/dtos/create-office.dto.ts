import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateOfficeDTO {
  @IsNotEmpty()
  name: string;

  // Name of the person creating the office; the office name when missing
  @IsOptional()
  @IsString()
  owner_name?: string;

  @IsNotEmpty()
  owner_email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  owner_password: string;

  owner_phone_number?: string | null;
  logo?: string | null;
}
