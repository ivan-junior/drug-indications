import { Test, TestingModule } from '@nestjs/testing';
import { MappingController } from './mapping.controller';
import { MappingService } from './mapping.service';

describe('MappingController', () => {
  let controller: MappingController;

  const mockMappingService = {
    mapToICD10: jest.fn().mockResolvedValue({
      code: 'J45.9',
      description: 'Asthma, unspecified',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MappingController],
      providers: [
        {
          provide: MappingService,
          useValue: mockMappingService,
        },
      ],
    }).compile();

    controller = module.get<MappingController>(MappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should map condition to ICD-10', async () => {
    const result = await controller.mapCondition('asthma');
    expect(result.code).toBe('J45.9');
    expect(result.description).toBe('Asthma, unspecified');
  });
});
