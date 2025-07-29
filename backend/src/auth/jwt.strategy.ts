import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Konstruktor JwtStrategy.
   * Menginisialisasi strategi JWT dengan konfigurasi yang diperlukan.
   *
   * @param authService - Service untuk autentikasi dan validasi token.
   */
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'devsecret',
      passReqToCallback: true,
    });
  }

  /**
   * Memvalidasi token JWT dan memastikan token tidak masuk dalam blacklist.
   *
   * @param req - Objek request dari Express yang berisi header Authorization.
   * @param payload - Payload yang telah didekode dari token JWT.
   * @returns Objek user yang berisi userId, username, dan role.
   * @throws UnauthorizedException jika token masuk dalam blacklist.
   */
  async validate(req: Request, payload: any) {
    const authHeader = req.headers['authorization'] || '';
    const token = Array.isArray(authHeader)
      ? authHeader[0]?.replace('Bearer ', '')
      : authHeader.replace('Bearer ', '');

    if (token && this.authService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token revoked');
    }

    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
