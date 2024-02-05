import { Test, TestingModule } from '@nestjs/testing';
import { TicketCurrencyService } from './ticket-currency.service';

describe('TicketCurrencyService', () => {
  let service: TicketCurrencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketCurrencyService],
    }).compile();

    service = module.get<TicketCurrencyService>(TicketCurrencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
