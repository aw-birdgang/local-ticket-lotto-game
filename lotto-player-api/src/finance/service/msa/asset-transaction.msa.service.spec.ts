import { Test, TestingModule } from '@nestjs/testing';
import { AssetTransactionMsaService } from './asset-transaction.msa.service';

describe('AssetTransactionMsService', () => {
  let service: AssetTransactionMsaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetTransactionMsaService],
    }).compile();

    service = module.get<AssetTransactionMsaService>(AssetTransactionMsaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
