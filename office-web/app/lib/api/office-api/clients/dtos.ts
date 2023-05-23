export interface Client {
  id: string;
  office_id: string;
  name: string;
  email: string;
  password: string;
  phone_number?: string | null;
  logo?: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date | null;
}
