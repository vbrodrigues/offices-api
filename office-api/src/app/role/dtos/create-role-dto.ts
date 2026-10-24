import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

// Job titles every new office starts with (existing offices got them in the
// per_office_roles_and_access_levels migration)
export const DEFAULT_ROLE_LABELS = [
  'Sócio(a)',
  'Arquiteto(a)',
  'Engenheiro(a)',
  'Estagiário(a)',
  'Administrativo',
];

// Role given to the employee who creates the office
export const OWNER_ROLE_LABEL = 'Sócio(a)';

export class CreateRoleDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  label: string;
}

export class RenameRoleDTO extends CreateRoleDTO {}
