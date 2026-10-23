import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateClientDTO {
  @IsOptional()
  @IsNotEmpty()
  name?: string | null;

  @IsOptional()
  @IsNotEmpty()
  email?: string | null;

  @IsOptional()
  phone_number?: string | null;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean | null;

  @IsOptional()
  logo?: string | null;
}
