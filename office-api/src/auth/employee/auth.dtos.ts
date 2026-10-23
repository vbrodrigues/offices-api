import { IsNotEmpty } from 'class-validator';

export class OfficeRequest {
  user: { employee_id: string; office_id: string; email: string };
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
