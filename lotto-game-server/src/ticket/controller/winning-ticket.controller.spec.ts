import { Test, TestingModule } from '@nestjs/testing';
import { WinningTicketController } from './winning-ticket.controller';

describe('WinningTicketController', () => {
  let controller: WinningTicketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WinningTicketController],
    }).compile();

    controller = module.get<WinningTicketController>(WinningTicketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
