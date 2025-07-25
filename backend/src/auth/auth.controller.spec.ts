import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  login: jest.fn(),
  logout: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call login', async () => {
    mockAuthService.login.mockResolvedValue({ access_token: 'token' });
    const req = { body: { username: 'admin', password: 'admin123' } };
    const result = await controller.login(req);
    expect(result.access_token).toBe('token');
    expect(mockAuthService.login).toHaveBeenCalledWith('admin', 'admin123');
  });

  it('should call logout', async () => {
    mockAuthService.logout.mockResolvedValue({
      message: 'Logout success (token revoked)',
    });
    const result = await controller.logout('Bearer sometoken');
    expect(result.message).toMatch(/Logout success/);
    expect(mockAuthService.logout).toHaveBeenCalledWith('sometoken');
  });

  it('should return message if no token on logout', async () => {
    const result = await controller.logout('');
    expect(result.message).toBe('No token provided');
  });
});
