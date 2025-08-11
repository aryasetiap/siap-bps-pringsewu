/**
 * File ini berisi implementasi strategi JWT untuk autentikasi pada aplikasi SIAP.
 * Digunakan untuk memvalidasi token JWT pada setiap permintaan, memastikan token tidak masuk blacklist,
 * dan mengembalikan informasi user yang terautentikasi.
 *
 * Konteks bisnis: Digunakan dalam pengelolaan barang, permintaan, dan verifikasi user di aplikasi SIAP.
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
/**
 * Kelas JwtStrategy digunakan untuk memvalidasi token JWT pada setiap permintaan.
 *
 * Parameter:
 * - authService (AuthService): Service untuk autentikasi dan validasi token.
 */
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Konstruktor JwtStrategy.
   * Menginisialisasi strategi JWT dengan konfigurasi yang diperlukan.
   *
   * Parameter:
   * - authService (AuthService): Service untuk autentikasi dan validasi token.
   */
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'devsecret',
      passReqToCallback: true,
    });
  }

  /**
   * Fungsi ini digunakan untuk memvalidasi token JWT dan memastikan token tidak masuk dalam blacklist.
   * Jika token valid dan tidak di-blacklist, mengembalikan informasi user.
   *
   * Parameter:
   * - req (Request): Objek request dari Express yang berisi header Authorization.
   * - payload (any): Payload yang telah didekode dari token JWT.
   *
   * Return:
   * - { userId: string, username: string, role: string }: Informasi user yang terautentikasi.
   *
   * Throws:
   * - UnauthorizedException: Jika token masuk dalam blacklist.
   */
  async validate(req: Request, payload: any) {
    // Mengambil token dari header Authorization
    const authHeader = req.headers['authorization'] || '';
    const token = Array.isArray(authHeader)
      ? authHeader[0]?.replace('Bearer ', '')
      : authHeader.replace('Bearer ', '');

    // Memastikan token tidak masuk blacklist (misal: logout, revoke)
    if (token && this.authService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token telah dicabut');
    }

    // Mengembalikan informasi user yang terautentikasi
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
