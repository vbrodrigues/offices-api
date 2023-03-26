import { IsNotEmpty } from 'class-validator';

export class UpdateProjectLikeDTO {
  @IsNotEmpty()
  is_active: boolean;
}

export interface UnlikeProjectPostDTO {
  project_post_id: string;
  liker_id: string;
}
