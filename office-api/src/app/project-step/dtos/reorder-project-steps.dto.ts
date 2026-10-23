import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class ReorderProjectStepsDTO {
  // Every step_id of the project, in the new order
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  step_ids: string[];
}
