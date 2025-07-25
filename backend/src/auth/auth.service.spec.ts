import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service'; // Tambahkan import ini
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

const mockUser = {
  id: 1,
  username: 'admin',
  password: bcrypt.hashSync('admin123', 10), // gunakan hashSync
  role: 'admin',
  nama: 'Admin',
};

const mockUserService = {
  findByUsername: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mocked.jwt.token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService }, // Ganti dari 'UserService' ke UserService
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login successfully', async () => {
    mockUserService.findByUsername.mockResolvedValue(mockUser);
    (jest.spyOn(bcrypt, 'compare') as any).mockResolvedValue(true);
    const result = await service.login('admin', 'admin123');
    expect(result.access_token).toBe('mocked.jwt.token');
    expect(result.user.username).toBe('admin');
  });

  it('should throw if user not found', async () => {
    mockUserService.findByUsername.mockResolvedValue(null);
    await expect(service.login('nouser', 'pass')).rejects.toThrow(
      'User not found',
    );
  });

  it('should throw if password invalid', async () => {
    mockUserService.findByUsername.mockResolvedValue(mockUser);
    (jest.spyOn(bcrypt, 'compare') as any).mockResolvedValue(false);
    await expect(service.login('admin', 'wrongpass')).rejects.toThrow(
      'Invalid password',
    );
  });

  it('should add token to blacklist on logout', () => {
    service.logout('sometoken');
    expect(service.isTokenBlacklisted('sometoken')).toBe(true);
  });

  it('should validate user with correct password', async () => {
    mockUserService.findByUsername.mockResolvedValue(mockUser);
    (jest.spyOn(bcrypt, 'compare') as any).mockResolvedValue(true);
    const result = await service.validateUser('admin', 'admin123');
    expect(result).not.toBeNull();
    expect(result!.username).toBe('admin');
    expect('password' in result!).toBe(false);
  });

  it('should return null if validateUser fails', async () => {
    mockUserService.findByUsername.mockResolvedValue(null);
    const result = await service.validateUser('nouser', 'pass');
    expect(result).toBeNull();
  });
});
