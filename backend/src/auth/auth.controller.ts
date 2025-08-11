/**
 * File ini berisi controller untuk autentikasi pengguna pada aplikasi SIAP.
 * Controller ini menangani proses login dan logout pengguna, serta mengelola token autentikasi.
 *
 * Konteks bisnis: Digunakan dalam proses pengelolaan barang, permintaan, dan verifikasi di aplikasi SIAP.
 */

import { Controller, Post, Req, Headers, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * Controller untuk autentikasi pengguna.
 *
 * Digunakan untuk menangani permintaan login dan logout pada aplikasi SIAP.
 */
@Controller('auth')
export class AuthController {
  /**
   * Konstruktor untuk AuthController.
   *
   * Parameter:
   * - authService (AuthService): Service yang menangani logika autentikasi.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint untuk login pengguna.
   *
   * Fungsi ini digunakan untuk memproses permintaan login dari pengguna.
   *
   * Parameter:
   * - req (Request): Objek request yang berisi data login pada body.
   *
   * Return:
   * - Promise<any>: Token autentikasi atau informasi pengguna jika login berhasil.
   */
  @Post('login')
  async login(@Req() req): Promise<any> {
    const { username, password } = req.body;
    // Validasi input dapat ditambahkan di sini jika diperlukan
    return this.authService.login(username, password);
  }

  /**
   * Endpoint untuk logout pengguna.
   *
   * Fungsi ini digunakan untuk memproses permintaan logout dari pengguna.
   *
   * Parameter:
   * - authHeader (string): Header 'authorization' yang berisi token Bearer.
   *
   * Return:
   * - Promise<any>: Pesan hasil logout atau pesan jika token tidak disediakan.
   */
  @Post('logout')
  async logout(@Headers('authorization') authHeader: string): Promise<any> {
    /**
     * Mengambil token dari header Authorization.
     * Jika token tidak ada, kembalikan pesan error.
     */
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return { message: 'Token tidak disediakan' };
    }
    return this.authService.logout(token);
  }
}
