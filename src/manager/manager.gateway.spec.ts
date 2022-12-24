import { Test, TestingModule } from '@nestjs/testing';
import { ManagerGateway } from './manager.gateway';
import { ManagerService } from './manager.service';

describe('ManagerGateway', () => {
  let gateway: ManagerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManagerGateway, ManagerService],
    }).compile();

    gateway = module.get<ManagerGateway>(ManagerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
