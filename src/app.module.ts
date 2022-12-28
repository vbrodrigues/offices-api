import { Module } from '@nestjs/common';
import { ClientModule } from './app/client/client.module';
import { OfficeModule } from './app/office/office.module';

@Module({
  imports: [OfficeModule, ClientModule],
})
export class AppModule {}
