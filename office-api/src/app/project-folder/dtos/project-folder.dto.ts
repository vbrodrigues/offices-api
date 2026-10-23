import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

// "/" separates folders in upload paths, so it can't be part of a name
export const FOLDER_NAME_PATTERN = /^[^/\\]+$/;

export class CreateProjectFolderDTO {
  @IsNotEmpty()
  project_id: string;

  // null or missing = root of the project
  @IsOptional()
  parent_id?: string | null;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(FOLDER_NAME_PATTERN, { message: 'name cannot contain / or \\' })
  name: string;

  // Default tags for files uploaded into the folder
  @IsOptional()
  category_id?: string | null;

  @IsOptional()
  project_step_id?: string | null;
}

// Only fields present change; null clears a tag or moves to the root
export class EditProjectFolderDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(FOLDER_NAME_PATTERN, { message: 'name cannot contain / or \\' })
  name?: string;

  @IsOptional()
  parent_id?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @IsOptional()
  category_id?: string | null;

  @IsOptional()
  project_step_id?: string | null;
}

export class CreateProjectFolderInternalDTO {
  id?: string;
  project_id: string;
  parent_id: string | null;
  name: string;
  position: number;
  category_id: string | null;
  project_step_id: string | null;
  created_by_id: string;
}

export class UpdateProjectFolderInternalDTO {
  name?: string;
  parent_id?: string | null;
  position?: number;
  category_id?: string | null;
  project_step_id?: string | null;
}
