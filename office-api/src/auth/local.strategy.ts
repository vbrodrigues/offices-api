import { UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super(
      { usernameField: 'email', passReqToCallback: true },
      function (req, email, password, done) {
        try {
          const employee = this.validate(email, password, req.body.office_id);
          done(null, employee);
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
    const employee = await this.authService.validateEmployee(
      email,
      password,
      office_id,
    );

    if (!employee) {
      throw new UnauthorizedException();
    }

    return employee;
  }
}
