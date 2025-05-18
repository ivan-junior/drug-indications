import { Test, TestingModule } from '@nestjs/testing';
import { IndicationsService } from './indications.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Model, Types } from 'mongoose';
import {
  Indication,
  IndicationSchema,
  IndicationDocument,
} from './indications.schema';
import { Drug, DrugSchema } from 'src/drugs/drugs.schema';
import { DrugsService } from 'src/drugs/drugs.service';
import { ScraperService } from 'src/scraper/scraper.service';
import { MappingService } from 'src/mapping/mapping.service';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';

describe('IndicationsService', () => {
  let indicationsService: IndicationsService;
  let indicationModel: Model<IndicationDocument>;
  let mongod: MongoMemoryServer;
  let drugId: Types.ObjectId;

  const mockScraperService = {
    extractIndications: jest.fn().mockResolvedValue(['asthma']),
  };

  const mockMappingService = {
    mapToICD10: jest.fn().mockResolvedValue({
      code: 'J45.9',
      description: 'Asthma, unspecified',
    }),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('fake-api-key'),
  };

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: Indication.name, schema: IndicationSchema },
          { name: Drug.name, schema: DrugSchema },
        ]),
      ],
      providers: [
        IndicationsService,
        DrugsService,
        { provide: ScraperService, useValue: mockScraperService },
        { provide: MappingService, useValue: mockMappingService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    indicationsService = module.get<IndicationsService>(IndicationsService);
    indicationModel = module.get<Model<IndicationDocument>>(
      getModelToken(Indication.name),
    );

    // cria um drug fake para usar nos testes
    const DrugModel = module.get('DrugModel');
    const drug = await new DrugModel({
      name: 'Dupixent',
      dailyMedUrl:
        'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=595f437d-2729-40bb-9c62-c8ece1f82780&audience=consumer',
    }).save();
    drugId = drug._id;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    // Limpa todas as indicações antes de cada teste
    await indicationModel.deleteMany({});
  });

  it('should be defined', () => {
    expect(indicationsService).toBeDefined();
  });

  it('should create an indication', async () => {
    const result = await indicationsService.create({
      drug: drugId.toString(),
      condition: 'asthma',
      icd10Code: 'J45.9',
      icd10Description: 'Asthma, unspecified',
      unmapped: false,
    });

    expect(result._id).toBeDefined();
    expect(result.condition).toBe('asthma');
    expect(result.icd10Code).toBe('J45.9');
  });

  it('should return indications for a drug', async () => {
    // Cria uma indicação primeiro
    const indication = await indicationsService.generateFromScraper(
      drugId.toString(),
    );

    expect(indication).toBeDefined();
    expect(Array.isArray(indication.indications)).toBe(true);
    expect(indication.indications.length).toBeGreaterThan(0);
    expect(indication.indications.at(0)?.icd10Code).toBe('J45.9');
  });

  it('should find one by id', async () => {
    const indication = (await indicationsService.create({
      drug: drugId.toString(),
      condition: 'asthma',
      icd10Code: 'J45.9',
      icd10Description: 'Asthma, unspecified',
      unmapped: false,
    })) as IndicationDocument;

    const one = await indicationsService.findOne(
      (indication._id as Types.ObjectId).toString(),
    );
    expect(one.condition).toBe('asthma');
  });

  it('should update an indication', async () => {
    const indication = (await indicationsService.create({
      drug: drugId.toString(),
      condition: 'asthma',
      icd10Code: 'J45.9',
      icd10Description: 'Asthma, unspecified',
      unmapped: false,
    })) as IndicationDocument;

    const updated = await indicationsService.update(
      (indication._id as Types.ObjectId).toString(),
      {
        icd10Code: 'J45.1',
      },
    );
    expect(updated.icd10Code).toBe('J45.1');
  });

  it('should delete an indication', async () => {
    // Cria a primeira indicação
    const indication1 = (await indicationsService.create({
      drug: drugId.toString(),
      condition: 'asthma',
      icd10Code: 'J45.9',
      icd10Description: 'Asthma, unspecified',
      unmapped: false,
    })) as IndicationDocument;

    // Cria a segunda indicação
    await indicationsService.create({
      drug: drugId.toString(),
      condition: 'rhinitis',
      icd10Code: 'J30.9',
      icd10Description: 'Allergic rhinitis, unspecified',
      unmapped: false,
    });

    await indicationsService.remove(
      (indication1._id as Types.ObjectId).toString(),
    );
    const after = await indicationsService.findByDrug(drugId.toString());

    expect(after.length).toBe(1); // Deve ter apenas a indicação de rinite
    expect(after[0].condition).toBe('rhinitis');
  });
});
