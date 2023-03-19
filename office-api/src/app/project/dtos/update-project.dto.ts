export type ProjectStatus = 'in_progress' | 'completed' | 'abandoned';

export class UpdateProjectDTO {
  name?: string;
  status?: ProjectStatus;
}
