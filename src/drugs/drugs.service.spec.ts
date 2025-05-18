import { Test, TestingModule } from '@nestjs/testing';
import { DrugsService } from './drugs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Drug, DrugSchema } from './drugs.schema';

describe('DrugsService', () => {
  let drugService: DrugsService;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: Drug.name, schema: DrugSchema }]),
      ],
      providers: [DrugsService],
    }).compile();

    drugService = module.get<DrugsService>(DrugsService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(drugService).toBeDefined();
  });

  it('should create and retrieve a drug', async () => {
    const drug = await drugService.create({
      name: 'Dupixent',
      manufacturer: 'Sanofi',
      dailyMedUrl: 'https://example.com',
    });

    expect(drug._id).toBeDefined();
    expect(drug.name).toBe('Dupixent');

    const found = await drugService.findOne(drug._id as string);
    expect(found.name).toBe('Dupixent');
  });

  it('should update a drug', async () => {
    const drug = await drugService.create({ name: 'Test', dailyMedUrl: '' });
    const updated = await drugService.update(drug._id as string, {
      name: 'Updated',
    });
    expect(updated.name).toBe('Updated');
  });

  it('should delete a drug', async () => {
    const drug = await drugService.create({
      name: 'ToDelete',
      dailyMedUrl: '',
    });
    await drugService.remove(drug._id as string);
    await expect(drugService.findOne(drug._id as string)).rejects.toThrow();
  });
});
