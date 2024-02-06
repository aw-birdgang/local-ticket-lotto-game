import { Test, TestingModule } from '@nestjs/testing';
import { WinningTicketService } from './winning-ticket.service';

describe('WinningTicketService', () => {
  let service: WinningTicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WinningTicketService],
    }).compile();

    service = module.get<WinningTicketService>(WinningTicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
