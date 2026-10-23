import { IsOptional } from 'class-validator';

export class UpdateProjectFileDTO {
  name?: string;
  path?: string;
  category_id?: string | null;
  project_step_id?: string | null;
}

// What the user can change on a file; null removes the link
export class EditProjectFileDTO {
  @IsOptional()
  category_id?: string | null;

  @IsOptional()
  project_step_id?: string | null;
}
