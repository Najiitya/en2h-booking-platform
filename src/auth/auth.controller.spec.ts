import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ access_token: 'mock_token' }),
    register: jest.fn().mockResolvedValue({ id: 'uuid-1', email: 'test@example.com' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const body = { email: 'test@example.com', password: 'password123' };
    expect(await controller.register(body)).toEqual({ id: 'uuid-1', email: 'test@example.com' });
    expect(mockAuthService.register).toHaveBeenCalledWith(body.email, body.password);
  });

  it('should login and return a token', async () => {
    const body = { email: 'test@example.com', password: 'password123' };
    expect(await controller.login(body)).toEqual({ access_token: 'mock_token' });
    expect(mockAuthService.login).toHaveBeenCalledWith(body.email, body.password);
  });
});