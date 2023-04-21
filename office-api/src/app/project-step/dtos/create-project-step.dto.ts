import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateProjectStepDTO {
  assigned_to?: string | null;

  @Type(() => Date)
  start_date?: Date | null;

  @Type(() => Date)
  end_date?: Date | null;

  step_hours?: number | null;
}

export class CreateProjectStepInternalDTO {
  @IsNotEmpty()
  project_id: string;

  @IsNotEmpty()
  step_id: string;

  assigned_to?: string;

  @Type(() => Date)
  start_date?: Date | null;

  @Type(() => Date)
  end_date?: Date | null;

  @IsNotEmpty()
  status: 'in-progress' | 'completed' | 'not-started' | 'on-hold';

  step_hours?: number;

  @IsDate()
  last_updated_at?: Date;

  last_updated_by?: string;
}
