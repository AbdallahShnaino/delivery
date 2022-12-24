import { Deliverer } from './entities/deliverer.entity';

export const deliverersProviders = [
  {
    provide: 'DELIVERERS_REPOSITORY',
    useValue: Deliverer,
  },
];
