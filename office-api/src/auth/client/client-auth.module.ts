import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport/dist';
import { DatabaseModule } from 'src/database/database.module';
import { ClientAuthService } from './client-auth.service';
import { ClientAuthController } from './client-auth.controller';
import { ClientLocalStrategy } from './client-local-strategy';
import { JwtStrategy } from '../employee/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  controllers: [ClientAuthController],
  providers: [ClientAuthService, ClientLocalStrategy, JwtStrategy],
})
export class ClientAuthModule {}
