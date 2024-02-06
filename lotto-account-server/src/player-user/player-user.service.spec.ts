import { Test, TestingModule } from '@nestjs/testing';
import { PlayerUserService } from './player-user.service';

describe('PlayerUserService', () => {
  let service: PlayerUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerUserService],
    }).compile();

    service = module.get<PlayerUserService>(PlayerUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
