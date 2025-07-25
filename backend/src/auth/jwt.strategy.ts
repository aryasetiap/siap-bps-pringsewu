import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'devsecret',
      passReqToCallback: true, // agar req bisa diakses di validate
    });
  }

  async validate(req: Request, payload: any) {
    // Ambil token dari header Authorization
    const authHeader = req.headers['authorization'] || '';
    const token = Array.isArray(authHeader)
      ? authHeader[0]?.replace('Bearer ', '')
      : authHeader.replace('Bearer ', '');

    // Cek blacklist
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
