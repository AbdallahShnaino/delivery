import { Manager } from './entities/manager.entity';

export const managersProviders = [
  {
    provide: 'MANAGERS_REPOSITORY',
    useValue: Manager,
  },
];
