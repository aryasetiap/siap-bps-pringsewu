import { Controller, Post, Req, UseGuards, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.body.username, req.body.password);
  }

  @Post('logout')
  async logout(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) return { message: 'No token provided' };
    return this.authService.logout(token);
  }
}
