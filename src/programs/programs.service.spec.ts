import { Test, TestingModule } from '@nestjs/testing';
import { ProgramsService } from './programs.service';
import { DrugsService } from '../drugs/drugs.service';
import { IndicationsService } from '../indications/indications.service';

describe('ProgramsService', () => {
  let service: ProgramsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgramsService,
        {
          provide: DrugsService,
          useValue: {
            findOne: jest
              .fn()
              .mockResolvedValue({ name: 'MockDrug', _id: '1' }),
          },
        },
        {
          provide: IndicationsService,
          useValue: {
            findByDrug: jest.fn().mockResolvedValue([
              {
                condition: 'asthma',
                icd10Code: 'J45.9',
                icd10Description: 'Asthma, unspecified',
                unmapped: false,
              },
            ]),
          },
        },
      ],
    }).compile();

    service = module.get<ProgramsService>(ProgramsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return program data', async () => {
    const result = await service.getProgram('1');
    expect(result.name).toBe('MockDrug');
    expect(result.indications).toHaveLength(1);
    expect(result.indications[0].icd10Code).toBe('J45.9');
  });
});
