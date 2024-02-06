import { Test, TestingModule } from '@nestjs/testing';
import { BatchJobService } from './batch-job.service';

describe('BatchJobService', () => {
  let service: BatchJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BatchJobService],
    }).compile();

    service = module.get<BatchJobService>(BatchJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
