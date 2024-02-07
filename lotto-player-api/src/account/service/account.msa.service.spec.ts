import { Test, TestingModule } from '@nestjs/testing';
import { AccountMsaService } from './account.msa.service';

describe('AccountMsaService', () => {
  let service: AccountMsaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountMsaService],
    }).compile();

    service = module.get<AccountMsaService>(AccountMsaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
