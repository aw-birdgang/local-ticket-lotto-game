import { Test, TestingModule } from '@nestjs/testing';
import { BatchAggregationService } from './batch-aggregation.service';

describe('BatchAggregationService', () => {
  let service: BatchAggregationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BatchAggregationService],
    }).compile();

    service = module.get<BatchAggregationService>(BatchAggregationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
