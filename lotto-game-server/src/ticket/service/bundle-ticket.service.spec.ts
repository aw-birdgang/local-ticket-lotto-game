import { Test, TestingModule } from '@nestjs/testing';
import { BundleTicketService } from './bundle-ticket.service';

describe('BundleTicketService', () => {
  let service: BundleTicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BundleTicketService],
    }).compile();

    service = module.get<BundleTicketService>(BundleTicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
