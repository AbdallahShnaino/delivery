import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ClientService } from 'src/client/client.service';
import { Client } from 'src/client/entities/client.entity';
import { DelivererService } from 'src/deliverer/deliverer.service';
import { Deliverer } from 'src/deliverer/entities/deliverer.entity';
import { Manager } from 'src/manager/entities/manager.entity';
import { ManagerService } from 'src/manager/manager.service';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: Client | Manager | Deliverer;
    }
  }
}

declare module 'express-session' {
  export interface SessionData {
    userId: number;
    type: string;
  }
}
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private clientService: ClientService,
    private managerService: ManagerService,
    private delivererService: DelivererService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId, type } = req.session || {};
    if (userId) {
      let user = null;
      if (type == 'client') {
        user = await this.clientService.findOne(userId);
      }
      if (type == 'deliverer') {
        user = await this.delivererService.findOne(userId);
      }
      if (type == 'manager') {
        user = await this.managerService.findOne(userId);
      }

      req.currentUser = user;
    }
    next();
  }
}
