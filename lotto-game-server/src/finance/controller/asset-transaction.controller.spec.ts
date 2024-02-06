import { Test, TestingModule } from '@nestjs/testing';
import { AssetTransactionController } from './asset-transaction.controller';

describe('AssetTransactionController', () => {
  let controller: AssetTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetTransactionController],
    }).compile();

    controller = module.get<AssetTransactionController>(AssetTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
