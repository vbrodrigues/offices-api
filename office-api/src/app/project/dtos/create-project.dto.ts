import { IsNotEmpty } from 'class-validator';
import { CreateProjectScheduleInternalDTO } from 'src/app/project-schedule/dtos/create-project-schedule.dto';

export class CreateProjectDTO {
  @IsNotEmpty()
  client_id: string;

  @IsNotEmpty()
  project_type_id: string;

  @IsNotEmpty()
  name: string;

  schedule?: CreateProjectScheduleInternalDTO;
}
