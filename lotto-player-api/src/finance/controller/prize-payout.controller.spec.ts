import { Test, TestingModule } from '@nestjs/testing';
import { PrizePayoutController } from './prize-payout.controller';

describe('PrizePayoutController', () => {
  let controller: PrizePayoutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrizePayoutController],
    }).compile();

    controller = module.get<PrizePayoutController>(PrizePayoutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
