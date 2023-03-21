import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Request } from '@nestjs/common/decorators/http/route-params.decorator';
import { ClientAuthService } from './client-auth.service';
import { ClientLocalAuthGuard } from './client-local-auth.guard';

@Controller('/clients-auth')
export class ClientAuthController {
  constructor(private authService: ClientAuthService) {}

  @UseGuards(ClientLocalAuthGuard)
  @Post('/login')
  async clientsLogin(@Request() request) {
    console.log(request);
    return this.authService.clientLogin(request.user);
  }
}
