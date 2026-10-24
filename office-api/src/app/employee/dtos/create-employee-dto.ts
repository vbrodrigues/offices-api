import { AccessLevel } from '@prisma/client';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateEmployeeDTO {
  @IsNotEmpty()
  office_id: string;

  // Job title of the office; optional
  @IsOptional()
  role_id?: string | null;

  // OWNER can't be given; PARTNER needs MANAGE_PARTNERS. Default MEMBER.
  @IsOptional()
  @IsIn([AccessLevel.PARTNER, AccessLevel.MEMBER])
  access_level?: AccessLevel;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  // Initial password, set by whoever registers the employee
  @IsNotEmpty()
  @Length(6)
  password: string;

  @IsOptional()
  phone_number?: string | null;

  @IsOptional()
  avatar?: string | null;
}

export class CreateEmployeeInternalDTO {
  office_id: string;
  role_id: string | null;
  access_level: AccessLevel;
  name: string;
  email: string;
  password: string;
  phone_number?: string | null;
  avatar?: string | null;
}
