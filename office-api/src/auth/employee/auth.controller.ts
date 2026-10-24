import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import {
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  Body,
  Request,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { HttpCode } from '@nestjs/common/decorators/http/http-code.decorator';
import { AuthService, Me } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import {
  EmployeeOffice,
  FindEmployeeOfficesDTO,
  OfficeRequest,
} from './auth.dtos';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() request) {
    return this.authService.login(request.user);
  }

  // The logged employee, their office and what they're allowed to do
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@Request() { user }: OfficeRequest): Promise<Me> {
    return this.authService.me(user.employee_id);
  }

  @HttpCode(200)
  @Post('/offices')
  async offices(
    @Body() { email, password }: FindEmployeeOfficesDTO,
  ): Promise<EmployeeOffice[]> {
    return this.authService.findEmployeeOffices(email, password);
  }
}
