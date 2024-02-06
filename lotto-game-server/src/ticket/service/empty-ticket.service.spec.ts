import { Test, TestingModule } from '@nestjs/testing';
import { EmptyTicketService } from './empty-ticket.service';

describe('EmptyTicketService', () => {
  let service: EmptyTicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmptyTicketService],
    }).compile();

    service = module.get<EmptyTicketService>(EmptyTicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
