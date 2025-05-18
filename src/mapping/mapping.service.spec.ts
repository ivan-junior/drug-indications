import { Test, TestingModule } from '@nestjs/testing';
import { MappingService } from './mapping.service';
import { ConfigService } from '@nestjs/config';

// Mock do módulo OpenAI
const mockCreate = jest.fn().mockResolvedValue({
  choices: [
    {
      message: {
        content: JSON.stringify({
          code: 'J45.9',
          description: 'Asthma, unspecified',
        }),
      },
    },
  ],
});

jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    })),
  };
});

describe('MappingService', () => {
  let service: MappingService;

  beforeEach(async () => {
    // Reset mock before each test
    mockCreate.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MappingService,
        {
          provide: ConfigService,
          useValue: {
            get: () => 'fake-api-key',
          },
        },
      ],
    }).compile();

    service = module.get<MappingService>(MappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a valid ICD-10 mapping', async () => {
    const result = await service.mapToICD10('asthma');
    expect(result.code).toBe('J45.9');
    expect(result.description).toBe('Asthma, unspecified');
  });

  it('should throw if response is invalid JSON', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: 'not json' } }],
    });

    await expect(service.mapToICD10('invalid')).rejects.toThrow(
      'Invalid GPT response',
    );
  });
});
