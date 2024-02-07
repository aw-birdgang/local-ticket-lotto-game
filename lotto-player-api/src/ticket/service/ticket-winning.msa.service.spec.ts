import { Test, TestingModule } from '@nestjs/testing';
import { TicketWinningMsaService } from './ticket-winning.msa.service';

describe('TicketWinngingMsService', () => {
  let service: TicketWinningMsaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketWinningMsaService],
    }).compile();

    service = module.get<TicketWinningMsaService>(TicketWinningMsaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
