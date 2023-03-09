import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ClientController } from './client.controller';
import { CreateClientUsecase } from './usecases/create-client.usecase';
import { EditClientUsecase } from './usecases/edit-client.usecase';
import { FindClientUsecase } from './usecases/find-client.usecase';
import { ListClientsUsecase } from './usecases/list-clients.usecase';

@Module({
  imports: [DatabaseModule],
  controllers: [ClientController],
  providers: [
    CreateClientUsecase,
    FindClientUsecase,
    ListClientsUsecase,
    EditClientUsecase,
  ],
})
export class ClientModule {}
