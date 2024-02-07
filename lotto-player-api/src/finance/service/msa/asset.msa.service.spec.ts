import { Test, TestingModule } from '@nestjs/testing';
import { AssetMsaService } from './asset.msa.service';

describe('AssetMsService', () => {
  let service: AssetMsaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetMsaService],
    }).compile();

    service = module.get<AssetMsaService>(AssetMsaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
