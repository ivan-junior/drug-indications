import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User, UserSchema } from './users.schema';
import * as mongoose from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const result = await service.create({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result).toEqual({ email: 'test@example.com' });
  });

  it('should find a user by email', async () => {
    const email = 'find@example.com';
    await service.create({ email, password: 'password123' });

    const found = await service.findByEmail(email);
    expect(found?.email).toBe(email);
  });

  it('should not find a non-existent user', async () => {
    const found = await service.findByEmail('notfound@example.com');
    expect(found).toBeNull();
  });
});
