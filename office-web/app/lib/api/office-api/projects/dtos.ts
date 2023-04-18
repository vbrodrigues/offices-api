import { ProjectType } from "../project-types/dtos";

export interface ProjectFile {
  id: string;
  project_id: string;
  created_by_id: string;
  path: string;
  name: string;
  created_at: Date;
  updated_at?: Date | null;
}

export interface Client {
  id: string;
  office_id: string;
  name: string;
  email: string;
  phone_number?: string | null;
  logo?: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date | null;
}

export interface Project {
  id: string;
  client_id: string;
  project_type_id: string;
  type: ProjectType;
  name: string;
  status: string;
  updated_at?: Date | null;
  created_at: Date;
  client: Client;
  files: ProjectFile[];
}
