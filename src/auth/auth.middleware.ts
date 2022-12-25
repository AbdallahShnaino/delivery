import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { Client } from 'src/client/entities/client.entity';
import { Deliverer } from 'src/deliverer/entities/deliverer.entity';
import { Manager } from 'src/manager/entities/manager.entity';
import { ClientService } from '../client/client.service';
import { DelivererService } from '../deliverer/deliverer.service';
import { ManagerService } from '../manager/manager.service';

export interface AuthSocket extends Socket {
  user: Manager | Client | Deliverer;
}
export type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => void;
export const WSAuthMiddleware = (
  jwtService: JwtService,
  clientService: ClientService,
  delivererService: DelivererService,
  managerService: ManagerService,
): SocketMiddleware => {
  return async (socket: AuthSocket, next) => {
    try {
      const logger = new Logger();
      const token =
        socket.handshake.auth.token || socket.handshake.headers['token'];

      const jwtPayload = jwtService.verify(token);
      logger.debug(`Validating auth token before connection: ${token}`);
      let userResult: Client | Manager | Deliverer = null;
      if (jwtPayload.type === 'client') {
        userResult = await clientService.findOne(jwtPayload.userId);
      }

      if (jwtPayload.type === 'deliverer') {
        userResult = await delivererService.findOne(jwtPayload.userId);
      }

      if (jwtPayload.type === 'manager') {
        userResult = await managerService.findOne(jwtPayload.userId);
      }

      if (userResult) {
        socket.user = userResult;
        next();
      } else {
        next({
          name: 'Unauthorizaed',
          message: 'Unauthorizaed',
        });
      }
    } catch (error) {
      next({
        name: 'Unauthorizaed',
        message: 'Unauthorizaed',
      });
    }
  };
};
