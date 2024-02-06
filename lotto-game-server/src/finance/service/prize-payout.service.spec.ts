import { Test, TestingModule } from '@nestjs/testing';
import { PrizePayoutService } from './prize-payout.service';

describe('PrizePayoutService', () => {
  let service: PrizePayoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrizePayoutService],
    }).compile();

    service = module.get<PrizePayoutService>(PrizePayoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
