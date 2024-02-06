import { Test, TestingModule } from '@nestjs/testing';
import { RoundWinningNumberService } from './round-winning-number.service';

describe('RoundWinningNumberService', () => {
  let service: RoundWinningNumberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoundWinningNumberService],
    }).compile();

    service = module.get<RoundWinningNumberService>(RoundWinningNumberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
