import { Test, TestingModule } from '@nestjs/testing';
import { WinningNumberService } from './winning-number.service';

describe('WinningNumberService', () => {
  let service: WinningNumberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WinningNumberService],
    }).compile();

    service = module.get<WinningNumberService>(WinningNumberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
