import { MiddlewareConsumer, Module, Scope } from '@nestjs/common';
import { ClientModule } from './client/client.module';
import { OrderModule } from './order/order.module';
import { ManagerModule } from './manager/manager.module';
import { DelivererModule } from './deliverer/deliverer.module';
import { SharedModule } from './shared/shared.module';
import { DatabaseModule } from './database/database.module';
import { CurrentUserMiddleware } from './middleware/current-user.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Module({
  imports: [
    DatabaseModule,
    ClientModule,
    OrderModule,
    ManagerModule,
    DelivererModule,
    SharedModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
