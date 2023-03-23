import { IsNotEmpty } from 'class-validator';

export class UpdateProjectLikeDTO {
  @IsNotEmpty()
  is_active: boolean;
}
