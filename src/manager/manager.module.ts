import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerGateway } from './manager.gateway';
import { managersProviders } from './manager.providers';
import { SharedModule } from 'src/shared/shared.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, SharedModule],
  providers: [ManagerGateway, ManagerService, ...managersProviders],
  exports: [ManagerService],
})
export class ManagerModule {}
