import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateProjectScheduleDTO {
  @IsNotEmpty()
  project_id: string;

  @IsNotEmpty()
  assigned_employee_id: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  start_date: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  end_date: Date;
}

export class CreateProjectScheduleInternalDTO {
  @IsNotEmpty()
  assigned_employee_id: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  start_date: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  end_date: Date;
}
