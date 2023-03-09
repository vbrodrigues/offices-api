import { UnauthorizedException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private moduleRef: ModuleRef) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request, payload: any) {
    if (request.body.office_id) {
      if (request.body.office_id !== payload.office_id) {
        throw new UnauthorizedException();
      }
    }

    if (request.params.id) {
      if (request.params.id !== payload.office_id) {
        throw new UnauthorizedException();
      }
    }

    return {
      employee_id: payload.sub,
      office_id: payload.office_id,
      email: payload.email,
    };
  }
}
