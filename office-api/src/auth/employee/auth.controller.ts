import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  Body,
  Request,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { HttpCode } from '@nestjs/common/decorators/http/http-code.decorator';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { EmployeeOffice, FindEmployeeOfficesDTO } from './auth.dtos';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() request) {
    return this.authService.login(request.user);
  }

  @HttpCode(200)
  @Post('/offices')
  async offices(
    @Body() { email, password }: FindEmployeeOfficesDTO,
  ): Promise<EmployeeOffice[]> {
    return this.authService.findEmployeeOffices(email, password);
  }
}
