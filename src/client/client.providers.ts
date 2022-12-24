import { Client } from './entities/client.entity';

export const clientsProviders = [
  {
    provide: 'CLIENTS_REPOSITORY',
    useValue: Client,
  },
];
