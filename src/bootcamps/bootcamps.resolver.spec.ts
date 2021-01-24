import { Test, TestingModule } from '@nestjs/testing';
import { BootcampsResolver } from './bootcamps.resolver';

describe('BootcampsResolver', () => {
  let resolver: BootcampsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BootcampsResolver],
    }).compile();

    resolver = module.get<BootcampsResolver>(BootcampsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
