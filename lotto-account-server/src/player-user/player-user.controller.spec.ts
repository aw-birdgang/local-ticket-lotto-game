import { Test, TestingModule } from '@nestjs/testing';
import { PlayerUserController } from './player-user.controller';

describe('PlayerUserController', () => {
  let controller: PlayerUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerUserController],
    }).compile();

    controller = module.get<PlayerUserController>(PlayerUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
