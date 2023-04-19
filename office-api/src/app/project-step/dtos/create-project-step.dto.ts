import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateProjectStepDTO {
  @IsNotEmpty()
  project_id: string;

  @IsNotEmpty()
  project_step_id: string;

  assigned_to?: string | null;

  @IsDate()
  @Type(() => Date)
  start_date?: Date | null;

  @IsDate()
  @Type(() => Date)
  end_date?: Date | null;

  @IsNotEmpty()
  status: string;

  step_hours?: number | null;

  @IsDate()
  last_updated_at?: Date | null;

  last_updated_by?: string | null;
}

export class CreateProjectStepInternalDTO {
  @IsNotEmpty()
  project_id: string;

  @IsNotEmpty()
  project_step_id: string;

  assigned_to?: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  start_date: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  end_date: Date;

  @IsNotEmpty()
  status: string;

  step_hours?: number;

  @IsDate()
  last_updated_at?: Date;

  last_updated_by?: string;
}
