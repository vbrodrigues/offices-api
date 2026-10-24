import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { AccessLevel, Employee } from '@prisma/client';
import { OfficeRequest } from 'src/auth/employee/auth.dtos';
import { can, Permission } from 'src/auth/employee/permissions';
import { RolesRepository } from '../role/role.repository';

type Caller = OfficeRequest['user'];

// Rules for acting on another employee, on top of MANAGE_EMPLOYEES:
// nobody acts on themselves through these endpoints (that's /employees/me),
// nobody touches the office's OWNER, and only who has MANAGE_PARTNERS acts
// on a PARTNER.
export function assertCanManageEmployee(caller: Caller, target: Employee) {
  if (target.office_id !== caller.office_id) {
    throw new UnauthorizedException();
  }

  if (target.id === caller.employee_id) {
    throw new ForbiddenException('You cannot do this to yourself.');
  }

  if (target.access_level === AccessLevel.OWNER) {
    throw new ForbiddenException('The office owner cannot be changed.');
  }

  if (
    target.access_level === AccessLevel.PARTNER &&
    !can(caller.access_level, Permission.MANAGE_PARTNERS)
  ) {
    throw new ForbiddenException('Only the owner can change a partner.');
  }
}

// Granting PARTNER (at creation or later) needs MANAGE_PARTNERS
export function assertCanGrant(caller: Caller, access_level?: AccessLevel) {
  if (access_level === AccessLevel.OWNER) {
    throw new ForbiddenException('There is only one owner per office.');
  }

  if (
    access_level === AccessLevel.PARTNER &&
    !can(caller.access_level, Permission.MANAGE_PARTNERS)
  ) {
    throw new ForbiddenException('Only the owner can make someone a partner.');
  }
}

// A job title must be one of the caller's office
export async function assertRoleOfOffice(
  rolesRepository: RolesRepository,
  office_id: string,
  role_id: string | null | undefined,
) {
  if (!role_id) return;

  const role = await rolesRepository.findById(role_id);

  if (!role || role.office_id !== office_id) {
    throw new BadRequestException('Role not found in the office.');
  }
}
