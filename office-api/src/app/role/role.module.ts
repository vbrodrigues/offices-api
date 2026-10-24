import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { RoleController } from './role.controller';
import { CreateRoleUsecase } from './usecases/create-role.usecase';
import { DeleteRoleUsecase } from './usecases/delete-role.usecase';
import { ListRolesUsecase } from './usecases/list-roles.usecase';
import { RenameRoleUsecase } from './usecases/rename-role.usecase';

@Module({
  imports: [DatabaseModule],
  controllers: [RoleController],
  providers: [
    CreateRoleUsecase,
    ListRolesUsecase,
    RenameRoleUsecase,
    DeleteRoleUsecase,
  ],
})
export class RoleModule {}
