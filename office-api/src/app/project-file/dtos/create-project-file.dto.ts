import { IsNotEmpty } from 'class-validator';

export class CreateProjectFileInternalDTO {
  // Set when the id must be known before inserting (batch uploads)
  id?: string;

  @IsNotEmpty()
  project_id: string;

  // null or missing = root of the project
  folder_id?: string | null;

  category_id?: string | null;

  project_step_id?: string | null;

  @IsNotEmpty()
  created_by_id: string;

  // Storage key of the file
  @IsNotEmpty()
  path: string;

  name?: string;

  // Size in bytes
  size?: number | null;

  content_type?: string | null;
}
