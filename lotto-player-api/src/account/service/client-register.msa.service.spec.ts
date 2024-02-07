import { Test, TestingModule } from '@nestjs/testing';
import { ClientRegisterMsaService } from './client-register.msa.service';

describe('ClientRegisterService', () => {
  let service: ClientRegisterMsaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientRegisterMsaService],
    }).compile();

    service = module.get<ClientRegisterMsaService>(ClientRegisterMsaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
