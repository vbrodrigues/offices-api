import { Type } from 'class-transformer';
import { IsDate, IsIn, IsOptional } from 'class-validator';
import { PROJECT_STEP_STATUSES } from './create-project-step.dto';

export class UpdateProjectStepDTO {
  @IsOptional()
  @IsIn(PROJECT_STEP_STATUSES)
  status?: string;

  @IsOptional()
  step_hours?: number;

  @IsOptional()
  assigned_to?: string | null;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  start_date?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  end_date?: Date;
}

export class UpdateProjectStepInternalDTO {
  status?: string;
  step_hours?: number;
  assigned_to?: string | null;

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
