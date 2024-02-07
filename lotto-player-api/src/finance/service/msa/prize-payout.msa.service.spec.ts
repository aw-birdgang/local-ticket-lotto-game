import { Test, TestingModule } from '@nestjs/testing';
import { PrizePayoutMsaService } from './prize-payout.msa.service';

describe('PrizePayoutMsService', () => {
  let service: PrizePayoutMsaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrizePayoutMsaService],
    }).compile();

    service = module.get<PrizePayoutMsaService>(PrizePayoutMsaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
