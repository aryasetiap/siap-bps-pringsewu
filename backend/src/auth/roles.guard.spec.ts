/**
 * File ini berisi unit test untuk RolesGuard pada aplikasi SIAP.
 * RolesGuard digunakan untuk memverifikasi hak akses pengguna berdasarkan peran (role)
 * dalam proses pengelolaan barang, permintaan, dan verifikasi di SIAP.
 */

import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';

/**
 * Kelas pengujian untuk RolesGuard.
 *
 * Tujuan:
 * - Memastikan RolesGuard berfungsi sesuai dengan kebutuhan bisnis SIAP,
 *   yaitu hanya pengguna dengan role yang sesuai dapat mengakses fitur tertentu.
 */
describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  /**
   * Inisialisasi objek RolesGuard dan Reflector sebelum setiap pengujian.
   *
   * Parameter: Tidak ada
   * Return: Tidak ada
   */
  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() } as Reflector;
    guard = new RolesGuard(reflector);
  });

  /**
   * Pengujian: Harus mengizinkan akses jika tidak ada role yang dibutuhkan.
   *
   * Parameter: Tidak ada
   * Return: boolean (true jika akses diizinkan)
   */
  it('should allow if no roles required', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);

    // Simulasi context eksekusi pada aplikasi SIAP
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'admin' } }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;

    expect(guard.canActivate(context)).toBe(true);
  });

  /**
   * Pengujian: Harus mengizinkan akses jika user memiliki role yang dibutuhkan.
   *
   * Parameter: Tidak ada
   * Return: boolean (true jika akses diizinkan)
   */
  it('should allow if user has required role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'admin' } }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;

    expect(guard.canActivate(context)).toBe(true);
  });

  /**
   * Pengujian: Harus menolak akses jika user tidak memiliki role yang dibutuhkan.
   *
   * Parameter: Tidak ada
   * Return: boolean (false jika akses ditolak)
   */
  it('should deny if user does not have required role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);

    // Context tiruan untuk simulasi user dengan role yang tidak sesuai
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'pegawai' } }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;

    expect(guard.canActivate(context)).toBe(false);
  });
});
