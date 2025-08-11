/**
 * File ini berisi pengujian unit untuk AuthController pada aplikasi SIAP.
 * Pengujian meliputi proses login dan logout pengguna, serta validasi token.
 * 
 * Konteks bisnis: Digunakan untuk mengelola autentikasi pengguna dalam sistem pengelolaan barang, permintaan, dan verifikasi SIAP.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

/**
 * Mock service untuk AuthService.
 * Digunakan agar pengujian tidak bergantung pada implementasi asli AuthService.
 */
const mockAuthService = {
  login: jest.fn(),
  logout: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;

  /**
   * Membuat instance AuthController sebelum setiap pengujian.
   * 
   * Tujuan:
   * - Menyiapkan modul pengujian dengan controller dan service yang sudah dimock.
   * - Memastikan setiap pengujian berjalan dengan dependensi yang konsisten.
   */
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
  });

  /**
   * Menguji apakah AuthController berhasil didefinisikan.
   * 
   * Tujuan:
   * - Memastikan instance controller berhasil dibuat.
   * 
   * Return:
   * - void
   */
  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  /**
   * Menguji fungsi login pada AuthController.
   * 
   * Tujuan:
   * - Memastikan fungsi login memanggil AuthService.login dengan parameter yang benar.
   * - Memastikan token dikembalikan sesuai hasil dari AuthService.
   * 
   * Parameter:
   * - req (object): Berisi body dengan username dan password.
   * 
   * Return:
   * - Promise<{ access_token: string }>
   */
  it('should call login', async () => {
    mockAuthService.login.mockResolvedValue({ access_token: 'token' });

    const requestMock = { body: { username: 'admin', password: 'admin123' } };
    const result = await authController.login(requestMock);

    expect(result.access_token).toBe('token');
    expect(mockAuthService.login).toHaveBeenCalledWith('admin', 'admin123');
  });

  /**
   * Menguji fungsi logout pada AuthController dengan token yang valid.
   * 
   * Tujuan:
   * - Memastikan fungsi logout memanggil AuthService.logout dengan token yang benar.
   * - Memastikan pesan sukses dikembalikan jika token valid.
   * 
   * Parameter:
   * - authHeader (string): Header otorisasi berisi token.
   * 
   * Return:
   * - Promise<{ message: string }>
   */
  it('should call logout', async () => {
    mockAuthService.logout.mockResolvedValue({
      message: 'Logout success (token revoked)',
    });

    const authHeader = 'Bearer sometoken';
    const result = await authController.logout(authHeader);

    expect(result.message).toMatch(/Logout success/);
    expect(mockAuthService.logout).toHaveBeenCalledWith('sometoken');
  });

  /**
   * Menguji fungsi logout pada AuthController tanpa token.
   * 
   * Tujuan:
   * - Memastikan fungsi logout mengembalikan pesan jika token tidak diberikan.
   * 
   * Parameter:
   * - authHeader (string): Header otorisasi kosong.
   * 
   * Return:
   * - Promise<{ message: string }>
   */
  it('should return message if no token on logout', async () => {
    const result = await authController.logout('');
    expect(result.message).toBe('No token provided');
  });
});
