/**
 * File: create-user.dto.ts
 *
 * Data Transfer Object (DTO) untuk pembuatan user baru pada aplikasi SIAP.
 *
 * Digunakan untuk validasi data user saat proses registrasi atau penambahan user baru.
 * DTO ini memastikan data yang diterima sesuai dengan kebutuhan bisnis SIAP,
 * seperti pengelolaan barang, permintaan, dan verifikasi user.
 */

import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

/**
 * Kelas CreateUserDto digunakan untuk memvalidasi data pembuatan user baru.
 *
 * Parameter:
 * - nama (string): Nama lengkap user, wajib diisi.
 * - username (string): Username unik untuk login, wajib diisi.
 * - password (string): Password user, wajib diisi.
 * - role ('admin' | 'pegawai', opsional): Peran user dalam aplikasi SIAP, hanya bisa 'admin' atau 'pegawai'.
 * - unit_kerja (string, opsional): Unit kerja user, digunakan untuk pengelolaan barang dan permintaan.
 * - foto (string, opsional): URL atau path foto user, untuk identifikasi visual.
 *
 * Return:
 * - CreateUserDto: Objek DTO yang tervalidasi untuk proses pembuatan user.
 */
export class CreateUserDto {
  /**
   * Nama lengkap user.
   * Wajib diisi untuk identifikasi user dalam sistem SIAP.
   */
  @IsString()
  @IsNotEmpty()
  nama: string;

  /**
   * Username unik untuk login.
   * Digunakan sebagai identitas utama saat proses autentikasi.
   */
  @IsString()
  @IsNotEmpty()
  username: string;

  /**
   * Password user.
   * Wajib diisi untuk keamanan akses aplikasi SIAP.
   */
  @IsString()
  @IsNotEmpty()
  password: string;

  /**
   * Peran user dalam aplikasi SIAP.
   * Opsional, hanya bisa bernilai 'admin' atau 'pegawai'.
   * 'admin' memiliki hak akses penuh, 'pegawai' terbatas pada pengelolaan barang dan permintaan.
   */
  @IsString()
  @IsIn(['admin', 'pegawai'])
  @IsOptional()
  role?: 'admin' | 'pegawai';

  /**
   * Unit kerja user.
   * Opsional, digunakan untuk mengelompokkan user berdasarkan unit kerja terkait pengelolaan barang.
   */
  @IsString()
  @IsOptional()
  unit_kerja?: string;

  /**
   * URL atau path foto user.
   * Opsional, digunakan untuk identifikasi visual user dalam aplikasi SIAP.
   */
  @IsString()
  @IsOptional()
  foto?: string;
}
