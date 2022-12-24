import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientGateway } from './client.gateway';
import { SharedModule } from 'src/shared/shared.module';
import { clientsProviders } from './client.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, SharedModule],
  providers: [ClientGateway, ClientService, ...clientsProviders],
  exports: [ClientService],
})
export class ClientModule {}
