/**
 * File: update-user.dto.ts
 *
 * Data Transfer Object (DTO) untuk memperbarui data pengguna pada aplikasi SIAP.
 * DTO ini digunakan untuk validasi data saat melakukan update pada entitas User,
 * seperti pengelolaan barang, permintaan, dan verifikasi dalam sistem SIAP.
 *
 * Setiap properti bersifat opsional, sehingga hanya data yang ingin diubah saja yang perlu dikirimkan.
 */

import { IsString, IsOptional, IsIn, IsBoolean } from 'class-validator';

/**
 * Kelas DTO untuk memperbarui data pengguna.
 *
 * Parameter:
 * - nama (string, opsional): Nama lengkap pengguna.
 * - password (string, opsional): Password baru pengguna.
 * - role ('admin' | 'pegawai', opsional): Peran pengguna dalam sistem SIAP, hanya 'admin' atau 'pegawai'.
 * - unit_kerja (string, opsional): Unit kerja pengguna, digunakan untuk pengelolaan barang dan permintaan.
 * - status_aktif (boolean, opsional): Status aktif pengguna, true jika aktif, false jika tidak.
 * - foto (string, opsional): URL atau path foto pengguna.
 *
 * Return:
 * - UpdateUserDto: Objek DTO yang tervalidasi untuk proses update data pengguna.
 */
export class UpdateUserDto {
  /**
   * Nama lengkap pengguna.
   * Digunakan untuk identifikasi pengguna dalam proses pengelolaan barang dan permintaan.
   */
  @IsString()
  @IsOptional()
  nama?: string;

  /**
   * Password baru pengguna.
   * Wajib diisi jika ingin mengubah password untuk keamanan akses aplikasi SIAP.
   */
  @IsString()
  @IsOptional()
  password?: string;

  /**
   * Peran pengguna dalam sistem SIAP.
   * Hanya dapat bernilai 'admin' (pengelola utama) atau 'pegawai' (pengguna biasa).
   */
  @IsString()
  @IsIn(['admin', 'pegawai'])
  @IsOptional()
  role?: 'admin' | 'pegawai';

  /**
   * Unit kerja pengguna.
   * Penting untuk proses permintaan barang dan verifikasi oleh admin.
   */
  @IsString()
  @IsOptional()
  unit_kerja?: string;

  /**
   * Status aktif pengguna.
   * True jika pengguna masih aktif dalam sistem, false jika sudah tidak aktif.
   */
  @IsBoolean()
  @IsOptional()
  status_aktif?: boolean;

  /**
   * URL atau path foto pengguna.
   * Digunakan untuk identifikasi visual pada dashboard SIAP.
   */
  @IsString()
  @IsOptional()
  foto?: string;
}
