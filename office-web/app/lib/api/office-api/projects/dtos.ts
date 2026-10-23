import { Employee } from "../../employees/dtos";
import { Category } from "../categories/dtos";
import { Client } from "../clients/dtos";
import { Step } from "../steps/dtos";

export interface ProjectFile {
  id: string;
  project_id: string;
  created_by_id: string;
  category_id: string | null;
  // ProjectStep (of this project) the file belongs to
  project_step_id: string | null;
  // Folder the file is in; null = root of the project
  folder_id: string | null;
  // Temporary signed download URL (valid for 30 minutes)
  path: string | null;
  name: string;
  // Bytes; null for files uploaded before sizes were saved
  size: number | null;
  content_type: string | null;
  created_at: Date;
  updated_at?: Date | null;
  created_by: Employee;
  category: Category | null;
}

export interface ProjectStep {
  assigned_to?: string | null;
  assigned?: Employee | null;
  end_date: null;
  id: string;
  last_updated_at?: Date | null;
  last_updated_by: string;
  project_id: string;
  start_date?: Date | null;
  status: "in-progress" | "completed" | "not-started" | "on-hold";
  step: Step;
  step_hours?: number | null;
  step_id: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  updated_at?: Date | null;
  created_at: Date;
  client: Client;
  files: ProjectFile[];
  project_steps: ProjectStep[];
}
