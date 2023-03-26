import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProjectLikeDTO {
  @IsNotEmpty()
  project_post_id: string;

  @IsNotEmpty()
  liker_id: string;

  @IsNotEmpty()
  liker_name: string;

  @IsNotEmpty()
  liker_type: string;
}

export class CreateProjectLikeInternalDTO {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  project_post_id: string;

  @IsNotEmpty()
  liker_id: string;

  @IsNotEmpty()
  liker_name: string;

  @IsNotEmpty()
  liker_type: string;

  @IsNotEmpty()
  is_active: boolean;

  @IsNotEmpty()
  created_at: Date;
}
