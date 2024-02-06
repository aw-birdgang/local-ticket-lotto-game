import { Test, TestingModule } from '@nestjs/testing';
import { TicketIssueCurrencyService } from './ticket-issue-currency.service';

describe('TicketIssueCurrencyService', () => {
  let service: TicketIssueCurrencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketIssueCurrencyService],
    }).compile();

    service = module.get<TicketIssueCurrencyService>(TicketIssueCurrencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
