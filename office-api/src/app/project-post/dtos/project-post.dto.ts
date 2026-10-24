import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateProjectPostDTO {
  @IsNotEmpty()
  project_id: string;

  @IsOptional()
  @IsString()
  content?: string | null;

  // Base64 or data URL of an image or file to attach
  @IsOptional()
  @IsString()
  encoded_media?: string | null;

  // Extension of the attached media, e.g. "jpg"
  @IsOptional()
  @IsString()
  encoded_media_format?: string | null;
}

export interface CreateProjectPostInternalDTO {
  id: string;
  project_id: string;
  employee_id: string;
  content?: string | null;
  media?: string | null;
}

export class ProjectPostLikeDTO {
  @IsNotEmpty()
  project_post_id: string;
}

export class FeedQueryDTO {
  @IsOptional()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  ordering?: string = 'DESC';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}

// A post as the client sees it on the feed
export interface FeedPost {
  id: string;
  project_id: string;
  content: string | null;
  // Signed download URL, valid for a few minutes
  media_url: string | null;
  created_at: Date;
  author: { id: string; name: string };
  likes: number;
  // Whether the client reading the feed liked it
  liked: boolean;
}
