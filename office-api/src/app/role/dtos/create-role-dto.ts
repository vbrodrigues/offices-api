import { IsNotEmpty } from 'class-validator';

export class CreateRoleDTO {
  @IsNotEmpty()
  label: string;
}
