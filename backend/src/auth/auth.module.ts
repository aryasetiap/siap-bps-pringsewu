import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';

/**
 * Modul otentikasi untuk aplikasi.
 * 
 * Modul ini mengatur dependensi yang diperlukan untuk proses otentikasi,
 * seperti konfigurasi JWT, layanan pengguna, serta strategi otentikasi.
 * 
 * @module AuthModule
 * @description Mengelola proses otentikasi, pendaftaran JWT, dan menyediakan controller serta provider terkait otentikasi.
 */
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET', 'devsecret'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
