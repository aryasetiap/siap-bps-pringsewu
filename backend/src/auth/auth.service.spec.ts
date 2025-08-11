/**
 * File ini berisi pengujian unit untuk AuthService pada aplikasi SIAP.
 * AuthService bertanggung jawab atas proses autentikasi user, login, logout, dan validasi user.
 * Pengujian dilakukan menggunakan Jest dan NestJS TestingModule.
 *
 * Konteks bisnis aplikasi SIAP:
 * - User melakukan login untuk mengakses fitur pengelolaan barang, permintaan, dan verifikasi.
 * - Token JWT digunakan untuk otorisasi akses.
 * - Logout menambahkan token ke blacklist agar tidak dapat digunakan kembali.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

/**
 * Data user mock untuk simulasi proses autentikasi.
 */
const mockUser = {
  id: 1,
  username: 'admin',
  password: bcrypt.hashSync('admin123', 10),
  role: 'admin',
  nama: 'Admin',
};

/**
 * Mock service UserService untuk pengujian.
 */
const mockUserService = {
  findByUsername: jest.fn(),
};

/**
 * Mock service JwtService untuk pengujian.
 */
const mockJwtService = {
  sign: jest.fn().mockReturnValue('mocked.jwt.token'),
};

describe('AuthService', () => {
  let service: AuthService;

  /**
   * Membuat instance AuthService beserta dependensinya sebelum setiap pengujian.
   *
   * Parameter: Tidak ada.
   * Return: Tidak ada.
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
   *
   * Parameter: Tidak ada.
   * Return: Tidak ada.
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * Menguji proses login dengan kredensial yang benar.
   * User yang berhasil login akan mendapatkan access_token JWT dan data user.
   *
   * Parameter: Tidak ada.
   * Return: Tidak ada, hanya melakukan assertion.
   */
  it('should login successfully', async () => {
    mockUserService.findByUsername.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await service.login('admin', 'admin123');

    expect(result.access_token).toBe('mocked.jwt.token');
    expect(result.user.username).toBe('admin');
  });

  /**
   * Menguji proses login ketika user tidak ditemukan.
   * Jika user tidak ditemukan, maka akan melempar error 'User not found'.
   *
   * Parameter: Tidak ada.
   * Return: Tidak ada, hanya melakukan assertion.
   */
  it('should throw if user not found', async () => {
    mockUserService.findByUsername.mockResolvedValue(null);

    await expect(service.login('nouser', 'pass')).rejects.toThrow(
      'User not found',
    );
  });

  /**
   * Menguji proses login ketika password yang diberikan salah.
   * Jika password salah, maka akan melempar error 'Invalid password'.
   *
   * Parameter: Tidak ada.
   * Return: Tidak ada, hanya melakukan assertion.
   */
  it('should throw if password invalid', async () => {
    mockUserService.findByUsername.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(service.login('admin', 'wrongpass')).rejects.toThrow(
      'Invalid password',
    );
  });

  /**
   * Menguji proses logout dengan menambahkan token ke blacklist.
   * Token yang di-blacklist tidak dapat digunakan untuk akses selanjutnya.
   *
   * Parameter: Tidak ada.
   * Return: Tidak ada, hanya melakukan assertion.
   */
  it('should add token to blacklist on logout', () => {
    service.logout('sometoken');
    expect(service.isTokenBlacklisted('sometoken')).toBe(true);
  });

  /**
   * Menguji validasi user dengan password yang benar.
   * Jika validasi berhasil, mengembalikan data user tanpa field password.
   *
   * Parameter: Tidak ada.
   * Return: Tidak ada, hanya melakukan assertion.
   */
  it('should validate user with correct password', async () => {
    mockUserService.findByUsername.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await service.validateUser('admin', 'admin123');

    expect(result).not.toBeNull();
    expect(result!.username).toBe('admin');
    expect('password' in result!).toBe(false);
  });

  /**
   * Menguji validasi user ketika user tidak ditemukan.
   * Jika validasi gagal, mengembalikan null.
   *
   * Parameter: Tidak ada.
   * Return: Tidak ada, hanya melakukan assertion.
   */
  it('should return null if validateUser fails', async () => {
    mockUserService.findByUsername.mockResolvedValue(null);

    const result = await service.validateUser('nouser', 'pass');

    expect(result).toBeNull();
  });
});
