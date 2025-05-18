import { Test, TestingModule } from '@nestjs/testing';
import { ProgramsController } from './programs.controller';
import { ProgramsService } from './programs.service';

describe('ProgramsController', () => {
  let controller: ProgramsController;

  const mockProgramsService = {
    getProgram: jest.fn().mockResolvedValue({
      name: 'TestDrug',
      indications: [
        {
          condition: 'asthma',
          icd10Code: 'J45.9',
          icd10Description: 'Asthma, unspecified',
        },
      ],
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramsController],
      providers: [
        {
          provide: ProgramsService,
          useValue: mockProgramsService,
        },
      ],
    }).compile();

    controller = module.get<ProgramsController>(ProgramsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get program data', async () => {
    const result = await controller.getProgram('1');
    expect(result.name).toBe('TestDrug');
    expect(result.indications).toHaveLength(1);
    expect(result.indications[0].icd10Code).toBe('J45.9');
  });
});
