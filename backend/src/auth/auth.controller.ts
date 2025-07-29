import { Controller, Post, Req, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * Controller untuk menangani autentikasi pengguna.
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Endpoint untuk melakukan login pengguna.
   *
   * @param req - Objek request yang berisi username dan password pada body.
   * @returns Hasil autentikasi dari AuthService, biasanya token atau informasi pengguna.
   */
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.body.username, req.body.password);
  }

  /**
   * Endpoint untuk melakukan logout pengguna.
   *
   * @param authHeader - Header otorisasi yang berisi token Bearer.
   * @returns Pesan hasil logout atau pesan jika token tidak disediakan.
   */
  @Post('logout')
  async logout(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) return { message: 'No token provided' };
    return this.authService.logout(token);
  }
}
