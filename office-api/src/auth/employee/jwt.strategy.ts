import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AccessLevel } from '@prisma/client';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { employeeAuthCacheKey } from 'src/app/common/utils/auth-cache';
import { EmployeesRepository } from 'src/app/employee/employee.repository';
import { OfficeRequest } from './auth.dtos';

// Seconds an employee's access level and active flag are trusted before
// being read again; edits clear it right away (invalidateEmployeeAuth).
// cache-manager v4 only honors a TTL given as { ttl } in seconds.
const AUTH_CACHE_TTL_S = 30;

interface EmployeeAuthState {
  office_id: string;
  access_level: AccessLevel;
  is_active: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private employeesRepository: EmployeesRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request, payload: any): Promise<OfficeRequest['user']> {
    if (request.body.office_id) {
      if (request.body.office_id !== payload.office_id) {
        throw new UnauthorizedException();
      }
    }

    if (request.params.office_id) {
      if (request.params.office_id !== payload.office_id) {
        throw new UnauthorizedException();
      }
    }

    if (payload.aud !== 'employee') {
      throw new UnauthorizedException();
    }

    // The token stays valid for a day, so inactivations and access level
    // changes are read from the database, not from the token
    const state = await this.loadState(payload.sub);

    if (!state || !state.is_active || state.office_id !== payload.office_id) {
      throw new UnauthorizedException();
    }

    return {
      employee_id: payload.sub,
      office_id: payload.office_id,
      email: payload.email,
      access_level: state.access_level,
    };
  }

  private async loadState(
    employee_id: string,
  ): Promise<EmployeeAuthState | null> {
    const key = employeeAuthCacheKey(employee_id);
    const cached = await this.cacheManager.get<EmployeeAuthState>(key);

    if (cached) {
      return cached;
    }

    const employee = await this.employeesRepository.findById(employee_id);

    if (!employee) {
      return null;
    }

    const state = {
      office_id: employee.office_id,
      access_level: employee.access_level,
      is_active: employee.is_active,
    };
    await this.cacheManager.set(key, state, { ttl: AUTH_CACHE_TTL_S });

    return state;
  }
}
