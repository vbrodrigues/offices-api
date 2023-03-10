export class UpdateEmployeeDTO {
  role_id?: string;

  name?: string;

  email?: string;

  phone_number?: string | null;

  avatar?: string | null;

  is_active?: boolean | null;
}
