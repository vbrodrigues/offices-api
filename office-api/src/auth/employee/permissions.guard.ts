import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OfficeRequest } from './auth.dtos';
import { can, Permission } from './permissions';

const PERMISSIONS_KEY = 'permissions';

// Every listed permission is required. Use after JwtAuthGuard:
// @UseGuards(JwtAuthGuard, PermissionsGuard)
export const RequirePermission = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required =
      this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    const { user } = context.switchToHttp().getRequest<OfficeRequest>();

    // 403, not 401: the employee is logged in, just not allowed
    if (!required.every((permission) => can(user?.access_level, permission))) {
      throw new ForbiddenException('Not allowed for your access level.');
    }

    return true;
  }
}
