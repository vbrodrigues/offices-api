import { Module } from '@nestjs/common';
import { ClientModule } from './app/client/client.module';
import { OfficeModule } from './app/office/office.module';
import { RoleModule } from './app/role/role.module';

@Module({
  imports: [OfficeModule, ClientModule, RoleModule],
})
export class AppModule {}
