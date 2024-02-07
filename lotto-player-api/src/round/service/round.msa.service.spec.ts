import { Test, TestingModule } from '@nestjs/testing';
import { RoundMsaService } from './round.msa.service';

describe('RoundService', () => {
  let service: RoundMsaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoundMsaService],
    }).compile();

    service = module.get<RoundMsaService>(RoundMsaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
