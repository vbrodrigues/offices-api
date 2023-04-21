import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class UpdateProjectStepDTO {
  status?: string;
  step_hours?: number;
  assigned_to?: string;

  @IsDate()
  @Type(() => Date)
  start_date?: Date;

  @IsDate()
  @Type(() => Date)
  end_date?: Date;
}

export class UpdateProjectStepInternalDTO {
  status?: string;
  step_hours?: number;
  assigned_to?: string;

  @IsDate()
  @Type(() => Date)
  start_date?: Date;

  @IsDate()
  @Type(() => Date)
  end_date?: Date;

  last_updated_by?: string;

  @IsDate()
  @Type(() => Date)
  last_updated_at?: Date;
}
