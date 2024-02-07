import { Test, TestingModule } from '@nestjs/testing';
import { TicketMsaService } from './ticket.msa.service';

describe('TicketMsService', () => {
  let service: TicketMsaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketMsaService],
    }).compile();

    service = module.get<TicketMsaService>(TicketMsaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
