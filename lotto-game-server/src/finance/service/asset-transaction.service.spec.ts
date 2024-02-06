import { Test, TestingModule } from '@nestjs/testing';
import { AssetTransactionService } from './asset-transaction.service';

describe('AssetTransactionService', () => {
  let service: AssetTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetTransactionService],
    }).compile();

    service = module.get<AssetTransactionService>(AssetTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
