import { Sequelize } from 'sequelize-typescript';
import { Client } from 'src/client/entities/client.entity';
import { Deliverer } from 'src/deliverer/entities/deliverer.entity';
import { Manager } from 'src/manager/entities/manager.entity';
import { Order } from 'src/order/entities/order.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root1234',
        database: 'delivery_db',
      });

      sequelize.addModels([Client, Deliverer, Manager, Order]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
