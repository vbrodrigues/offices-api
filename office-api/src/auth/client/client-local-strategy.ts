import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ClientAuthService } from './client-auth.service';

@Injectable()
export class ClientLocalStrategy extends PassportStrategy(Strategy, 'client') {
  constructor(private authService: ClientAuthService) {
    super(
      {
        usernameField: 'email',
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        try {
          const client = this.validate(email, password, req.body.office_id);
          done(null, client);
        } catch (err) {
          done(err, null);
        }
      },
    );
  }

  async validate(
    email: string,
    password: string,
    office_id: string,
  ): Promise<any> {
    const client = await this.authService.validateClient(
      email,
      password,
      office_id,
    );

    if (!client) {
      throw new UnauthorizedException();
    }

    if (!client.is_active) {
      throw new UnauthorizedException();
    }

    return client;
  }
}
