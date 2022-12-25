import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGateway } from './auth.gateway';
import { SharedModule } from 'src/shared/shared.module';
import { ClientModule } from 'src/client/client.module';
import { ManagerModule } from 'src/manager/manager.module';
import { DelivererModule } from 'src/deliverer/deliverer.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SharedModule,
    ClientModule,
    ManagerModule,
    DelivererModule,
    JwtModule.register({
      secret: 'hiMySecret',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthGateway, AuthService],
})
export class AuthModule {}
