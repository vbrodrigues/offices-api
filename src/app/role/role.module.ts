import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { RoleController } from './role.controller';
import { CreateRoleUsecase } from './usecases/create-role.usecase';

@Module({
  imports: [DatabaseModule],
  controllers: [RoleController],
  providers: [CreateRoleUsecase],
})
export class RoleModule {}
