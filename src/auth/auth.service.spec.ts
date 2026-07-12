import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findByEmail: jest.fn().mockImplementation((email) => {
      if (email === 'test@example.com') {
        return Promise.resolve({ id: 'uuid-1', email, password: 'password123', role: 'customer' });
      }
      return Promise.resolve(null);
    }),
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'uuid-2', ...dto })),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mock_jwt_token_string'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user', async () => {
    const result = await service.register('new@example.com', 'pass123');
    expect(result).toEqual({ id: 'uuid-2', email: 'new@example.com', password: 'pass123', role: 'customer' });
  });

  it('should reject registration if user exists', async () => {
    await expect(service.register('test@example.com', 'pass123')).rejects.toThrow(BadRequestException);
  });

  it('should login and return a token', async () => {
    const result = await service.login('test@example.com', 'password123');
    expect(result).toEqual({ access_token: 'mock_jwt_token_string' });
  });

  it('should throw UnauthorizedException on bad login', async () => {
    await expect(service.login('test@example.com', 'wrong')).rejects.toThrow(UnauthorizedException);
  });
});