import { IsNotEmpty } from 'class-validator';

export class CreateStepDTO {
  @IsNotEmpty()
  name: string;
}

export class CreateStepInternalDTO {
  @IsNotEmpty()
  office_id: string;

  @IsNotEmpty()
  name: string;
}
