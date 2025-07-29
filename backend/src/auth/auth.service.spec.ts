import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

const mockUser = {
  id: 1,
  username: 'admin',
  password: bcrypt.hashSync('admin123', 10),
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

  /**
   * Membuat instance AuthService beserta dependensinya sebelum setiap pengujian.
   * Tidak menerima parameter.
   * Tidak mengembalikan nilai.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  /**
   * Menguji apakah instance AuthService berhasil dibuat.
   * Tidak menerima parameter.
   * Tidak mengembalikan nilai.
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * Menguji proses login dengan kredensial yang benar.
   * Tidak menerima parameter.
   * Tidak mengembalikan nilai, hanya melakukan assertion.
   */
  it('should login successfully', async () => {
    mockUserService.findByUsername.mockResolvedValue(mockUser);
    (jest.spyOn(bcrypt, 'compare') as any).mockResolvedValue(true);
    const result = await service.login('admin', 'admin123');
    expect(result.access_token).toBe('mocked.jwt.token');
    expect(result.user.username).toBe('admin');
  });

  /**
   * Menguji proses login ketika user tidak ditemukan.
   * Tidak menerima parameter.
   * Tidak mengembalikan nilai, hanya melakukan assertion.
   */
  it('should throw if user not found', async () => {
    mockUserService.findByUsername.mockResolvedValue(null);
    await expect(service.login('nouser', 'pass')).rejects.toThrow(
      'User not found',
    );
  });

  /**
   * Menguji proses login ketika password yang diberikan salah.
   * Tidak menerima parameter.
   * Tidak mengembalikan nilai, hanya melakukan assertion.
   */
  it('should throw if password invalid', async () => {
    mockUserService.findByUsername.mockResolvedValue(mockUser);
    (jest.spyOn(bcrypt, 'compare') as any).mockResolvedValue(false);
    await expect(service.login('admin', 'wrongpass')).rejects.toThrow(
      'Invalid password',
    );
  });

  /**
   * Menguji proses logout dengan menambahkan token ke blacklist.
   * Tidak menerima parameter.
   * Tidak mengembalikan nilai, hanya melakukan assertion.
   */
  it('should add token to blacklist on logout', () => {
    service.logout('sometoken');
    expect(service.isTokenBlacklisted('sometoken')).toBe(true);
  });

  /**
   * Menguji validasi user dengan password yang benar.
   * Tidak menerima parameter.
   * Tidak mengembalikan nilai, hanya melakukan assertion.
   */
  it('should validate user with correct password', async () => {
    mockUserService.findByUsername.mockResolvedValue(mockUser);
    (jest.spyOn(bcrypt, 'compare') as any).mockResolvedValue(true);
    const result = await service.validateUser('admin', 'admin123');
    expect(result).not.toBeNull();
    expect(result!.username).toBe('admin');
    expect('password' in result!).toBe(false);
  });

  /**
   * Menguji validasi user ketika user tidak ditemukan.
   * Tidak menerima parameter.
   * Tidak mengembalikan nilai, hanya melakukan assertion.
   */
  it('should return null if validateUser fails', async () => {
    mockUserService.findByUsername.mockResolvedValue(null);
    const result = await service.validateUser('nouser', 'pass');
    expect(result).toBeNull();
  });
});
