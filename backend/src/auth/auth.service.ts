/**
 * File: auth.service.ts
 *
 * Service ini digunakan untuk menangani proses autentikasi pengguna pada aplikasi SIAP,
 * termasuk validasi kredensial, login, logout, dan manajemen blacklist token JWT.
 *
 * Konteks bisnis: Digunakan untuk memastikan hanya pengguna yang terverifikasi yang dapat
 * mengakses fitur pengelolaan barang, permintaan, dan verifikasi pada aplikasi SIAP.
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

/**
 * Kelas AuthService bertanggung jawab untuk proses autentikasi pengguna.
 *
 * Fitur utama:
 * - Validasi kredensial pengguna
 * - Proses login dan pembuatan token JWT
 * - Proses logout dan blacklist token
 * - Pengecekan status blacklist token
 */
@Injectable()
export class AuthService {
  /**
   * Set untuk menyimpan token JWT yang telah di-blacklist (logout).
   */
  private readonly tokenBlacklist: Set<string> = new Set();

  /**
   * Konstruktor untuk inisialisasi dependensi UserService dan JwtService.
   *
   * Parameter:
   * - userService (UserService): Service untuk manajemen data pengguna.
   * - jwtService (JwtService): Service untuk pembuatan dan verifikasi JWT.
   */
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Fungsi untuk memvalidasi kredensial pengguna berdasarkan username dan password.
   * Digunakan pada proses login dan verifikasi akses.
   *
   * Parameter:
   * - username (string): Nama pengguna yang akan divalidasi.
   * - password (string): Password yang akan divalidasi.
   *
   * Return:
   * - object | null: Data user tanpa password jika valid, null jika tidak valid.
   */
  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<any, 'password'> | null> {
    const user = await this.userService.findByUsername(username);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    // Menghilangkan field password dari hasil return
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Fungsi untuk melakukan proses login pengguna.
   * Jika kredensial valid, menghasilkan token JWT dan data user.
   *
   * Parameter:
   * - username (string): Nama pengguna yang akan login.
   * - password (string): Password pengguna.
   *
   * Return:
   * - object: Berisi access_token dan data user jika login berhasil.
   *
   * Throw:
   * - UnauthorizedException: Jika user tidak ditemukan atau password salah.
   */
  async login(
    username: string,
    password: string,
  ): Promise<{ access_token: string; user: any }> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Payload JWT berisi informasi penting untuk otorisasi
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        nama: user.nama,
      },
    };
  }

  /**
   * Fungsi untuk melakukan proses logout pengguna.
   * Token JWT yang digunakan akan dimasukkan ke blacklist agar tidak bisa digunakan lagi.
   *
   * Parameter:
   * - token (string): Token JWT yang akan di-blacklist.
   *
   * Return:
   * - object: Pesan konfirmasi logout berhasil.
   */
  logout(token: string): { message: string } {
    this.tokenBlacklist.add(token);
    return { message: 'Logout berhasil (token telah di-revoke)' };
  }

  /**
   * Fungsi untuk mengecek apakah token JWT sudah masuk ke dalam blacklist.
   * Digunakan untuk memastikan token yang sudah logout tidak bisa digunakan lagi.
   *
   * Parameter:
   * - token (string): Token JWT yang akan dicek.
   *
   * Return:
   * - boolean: True jika token ada di blacklist, false jika tidak.
   */
  isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }
}
