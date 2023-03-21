import { UnauthorizedException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class ClientJwtStrategy extends PassportStrategy(
  Strategy,
  'client-jwt',
) {
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

    if (request.params.office_id) {
      if (request.params.office_id !== payload.office_id) {
        throw new UnauthorizedException();
      }
    }

    return {
      client_id: payload.sub,
      office_id: payload.office_id,
      email: payload.email,
    };
  }
}
