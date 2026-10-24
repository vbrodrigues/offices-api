import { AccessLevel } from '@prisma/client';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class OfficeRequest {
  user: {
    employee_id: string;
    office_id: string;
    email: string;
    // Read from the database on each request (cached a few seconds)
    access_level: AccessLevel;
  };
}

export class FindEmployeeOfficesDTO {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export interface EmployeeOffice {
  id: string;
  name: string;
}

export class ChangePasswordDTO {
  @IsNotEmpty()
  current_password: string;

  @IsNotEmpty()
  @IsStrongPassword()
  new_password: string;
}
