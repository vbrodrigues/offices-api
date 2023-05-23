import { Role } from "../roles/dtos";

export interface Employee {
  avatar?: string | null;
  created_at: Date;
  email: string;
  id: string;
  is_active: boolean;
  name: string;
  office_id: string;
  phone_number: string;
  role_id: string;
  role: Role;
  updated_at?: Date | null;
}
