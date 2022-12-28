import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OfficeModule } from './office/office.module';

@Module({
  imports: [OfficeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
