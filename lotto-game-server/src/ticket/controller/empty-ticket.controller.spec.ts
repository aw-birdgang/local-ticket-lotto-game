import { Test, TestingModule } from '@nestjs/testing';
import { EmptyTicketController } from './empty-ticket.controller';

describe('EmptyTicketController', () => {
  let controller: EmptyTicketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmptyTicketController],
    }).compile();

    controller = module.get<EmptyTicketController>(EmptyTicketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
