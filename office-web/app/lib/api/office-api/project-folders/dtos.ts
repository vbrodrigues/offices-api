export interface ProjectFolder {
  id: string;
  project_id: string;
  // null = folder at the root of the project
  parent_id: string | null;
  name: string;
  // Order among its siblings
  position: number;
  // Default tags for files uploaded into the folder
  category_id: string | null;
  project_step_id: string | null;
  created_by_id: string;
  created_at: Date;
  updated_at?: Date | null;
}
