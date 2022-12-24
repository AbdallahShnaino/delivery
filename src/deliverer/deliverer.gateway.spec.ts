import { Test, TestingModule } from '@nestjs/testing';
import { DelivererGateway } from './deliverer.gateway';
import { DelivererService } from './deliverer.service';

describe('DelivererGateway', () => {
  let gateway: DelivererGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DelivererGateway, DelivererService],
    }).compile();

    gateway = module.get<DelivererGateway>(DelivererGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
