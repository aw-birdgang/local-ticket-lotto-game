import { Test, TestingModule } from '@nestjs/testing';
import { GameWinningRuleService } from './game-winning-rule.service';

describe('GameWinningRuleService', () => {
  let service: GameWinningRuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameWinningRuleService],
    }).compile();

    service = module.get<GameWinningRuleService>(GameWinningRuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
