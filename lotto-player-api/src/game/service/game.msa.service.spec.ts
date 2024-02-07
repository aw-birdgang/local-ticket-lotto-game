import { Test, TestingModule } from '@nestjs/testing';
import { GameMsaService } from './game.msa.service';

describe('GameService', () => {
  let service: GameMsaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameMsaService],
    }).compile();

    service = module.get<GameMsaService>(GameMsaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
