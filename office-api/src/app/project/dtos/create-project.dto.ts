import { IsNotEmpty } from 'class-validator';

export class CreateProjectDTO {
  @IsNotEmpty()
  client_id: string;

  @IsNotEmpty()
  name: string;

  steps?: string[];
}

export class CreateProjectInternalDTO {
  @IsNotEmpty()
  client_id: string;

  @IsNotEmpty()
  name: string;
}
