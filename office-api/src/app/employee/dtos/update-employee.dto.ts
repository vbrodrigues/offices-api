import { AccessLevel } from '@prisma/client';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

// What an admin can change on an employee. Active flag and access level have
// endpoints of their own.
export class EditEmployeeDTO {
  // null removes the job title
  @IsOptional()
  role_id?: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  phone_number?: string | null;

  // Base64/data URL of a new avatar
  @IsOptional()
  avatar?: string | null;
}

// What employees can change on their own profile
export class EditMyProfileDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  phone_number?: string | null;

  @IsOptional()
  avatar?: string | null;
}

export class ChangeAccessLevelDTO {
  // OWNER is never given; there is one per office
  @IsIn([AccessLevel.PARTNER, AccessLevel.MEMBER])
  access_level: AccessLevel;
}

export class UpdateEmployeeDTO {
  role_id?: string | null;
  access_level?: AccessLevel;
  name?: string;
  email?: string;
  password?: string;
  phone_number?: string | null;
  avatar?: string | null;
  is_active?: boolean;
}
