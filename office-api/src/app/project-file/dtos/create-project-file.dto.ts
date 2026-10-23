import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProjectFileDTO {
  @IsNotEmpty()
  project_id: string;

  @IsOptional()
  category_id?: string | null;

  // Step of this project the file belongs to
  @IsOptional()
  project_step_id?: string | null;

  // Base64 or a data URL of the file, of any type
  @IsNotEmpty()
  file: string;

  // Extension used for the stored file, e.g. "pdf", "dwg", "skp"
  @IsNotEmpty()
  fileFormat: string;

  @IsNotEmpty()
  name: string;
}

export class CreateProjectFileInternalDTO {
  @IsNotEmpty()
  project_id: string;

  category_id?: string | null;

  project_step_id?: string | null;

  @IsNotEmpty()
  created_by_id: string;

  // Storage key of the file
  @IsNotEmpty()
  path: string;

  name?: string;
}
