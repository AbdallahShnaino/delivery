import { Module } from '@nestjs/common';
import { DelivererService } from './deliverer.service';
import { DelivererGateway } from './deliverer.gateway';
import { deliverersProviders } from './deliverer.providers';
import { SharedModule } from 'src/shared/shared.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, SharedModule],
  providers: [DelivererGateway, DelivererService, ...deliverersProviders],
  exports: [DelivererService],
})
export class DelivererModule {}
