import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  const mockUser = {
    _id: 'user123',
    email: 'test@example.com',
    password: bcrypt.hashSync('secure123', 10),
    role: 'user',
    toObject: function () {
      const { password, ...rest } = this;
      return rest;
    },
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn().mockResolvedValue(mockUser),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('fake-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate a user with correct credentials', async () => {
    const result = await service.validateUser('test@example.com', 'secure123');
    expect(result).toBeDefined();
    expect(result.email).toBe('test@example.com');
  });

  it('should throw with incorrect password', async () => {
    await expect(
      service.validateUser('test@example.com', 'wrongpass'),
    ).rejects.toThrow();
  });

  it('should return a JWT token on login', async () => {
    const token = await service.login(mockUser);
    expect(token).toEqual({ access_token: 'fake-jwt-token' });
  });
});
