import { AccessLevel } from '@prisma/client';

// Checks name what is being done, not who may do it, so the mapping below can
// later become configurable per office without touching the endpoints.
export enum Permission {
  // Edit the office's own data and logo
  MANAGE_OFFICE = 'manage_office',
  // Create, edit, inactivate and reactivate employees; set their job title
  MANAGE_EMPLOYEES = 'manage_employees',
  // Grant or revoke the PARTNER access level
  MANAGE_PARTNERS = 'manage_partners',
  // Create, rename and delete job titles
  MANAGE_ROLES = 'manage_roles',
  // Create and delete step templates and file categories
  MANAGE_TEMPLATES = 'manage_templates',
  DELETE_CLIENTS = 'delete_clients',
  // Delete files uploaded by someone else (anyone can delete their own)
  DELETE_ANY_FILE = 'delete_any_file',
}

const PARTNER_PERMISSIONS = [
  Permission.MANAGE_OFFICE,
  Permission.MANAGE_EMPLOYEES,
  Permission.MANAGE_ROLES,
  Permission.MANAGE_TEMPLATES,
  Permission.DELETE_CLIENTS,
  Permission.DELETE_ANY_FILE,
];

export const ACCESS_LEVEL_PERMISSIONS: Record<AccessLevel, Permission[]> = {
  OWNER: [...PARTNER_PERMISSIONS, Permission.MANAGE_PARTNERS],
  PARTNER: PARTNER_PERMISSIONS,
  // Clients, projects, steps and their own files only
  MEMBER: [],
};

export function can(
  access_level: AccessLevel | undefined,
  permission: Permission,
): boolean {
  return (
    !!access_level &&
    ACCESS_LEVEL_PERMISSIONS[access_level].includes(permission)
  );
}
