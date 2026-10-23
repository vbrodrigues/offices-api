import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

// Files per upload request; the browser splits bigger selections
export const MAX_FILES_PER_BATCH = 100;
// A single S3 PUT can't be bigger than 5GB
export const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024;

export class UploadFileInfoDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  // Size in bytes
  @IsNumber()
  @Min(0)
  @Max(MAX_FILE_SIZE)
  size: number;

  // Empty for unknown types (the browser's File.type)
  @IsOptional()
  @IsString()
  content_type?: string;

  // Folders between the target folder and the file, for folder uploads:
  // "Levantamento/Fotos" for webkitRelativePath "Levantamento/Fotos/a.jpg"
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  relative_path?: string;
}

export class RequestProjectFileUploadsDTO {
  @IsNotEmpty()
  project_id: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_FILES_PER_BATCH)
  @ValidateNested({ each: true })
  @Type(() => UploadFileInfoDTO)
  files: UploadFileInfoDTO[];
}

export interface ProjectFileUpload {
  name: string;
  relative_path: string | null;
  // Send back in the batch confirmation
  key: string;
  // PUT the file here, with exactly this Content-Type header
  url: string;
  content_type: string;
}

export class UploadedFileDTO extends UploadFileInfoDTO {
  // Key returned by POST /project-files/uploads
  @IsString()
  @IsNotEmpty()
  key: string;

  // Tags; missing = the tags of the folder the file lands in
  @IsOptional()
  category_id?: string | null;

  @IsOptional()
  project_step_id?: string | null;
}

export class CreateProjectFilesBatchDTO {
  @IsNotEmpty()
  project_id: string;

  // Where the files (and the folders of relative_path) go; null = root
  @IsOptional()
  folder_id?: string | null;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_FILES_PER_BATCH)
  @ValidateNested({ each: true })
  @Type(() => UploadedFileDTO)
  files: UploadedFileDTO[];
}

export class MoveProjectFilesDTO {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  @IsString({ each: true })
  file_ids: string[];

  // null = root of the project
  @IsOptional()
  folder_id?: string | null;
}
