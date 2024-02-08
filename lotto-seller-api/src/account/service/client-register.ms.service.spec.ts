import { Test, TestingModule } from '@nestjs/testing';
import { ClientRegisterMsService } from './client-register.ms.service';

describe('ClientRegisterMsService', () => {
  let service: ClientRegisterMsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientRegisterMsService],
    }).compile();

    service = module.get<ClientRegisterMsService>(ClientRegisterMsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
