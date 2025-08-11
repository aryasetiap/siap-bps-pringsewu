/**
 * File: auth.module.ts
 *
 * Modul otentikasi untuk aplikasi SIAP.
 *
 * Modul ini bertanggung jawab untuk mengelola proses otentikasi pengguna,
 * termasuk pendaftaran JWT, integrasi dengan modul pengguna, serta
 * penyediaan controller dan provider terkait otentikasi.
 *
 * Konteks bisnis: Digunakan untuk verifikasi akses pengguna dalam pengelolaan barang dan permintaan di aplikasi SIAP.
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';

/**
 * Kelas AuthModule
 *
 * Modul utama untuk otentikasi pada aplikasi SIAP.
 *
 * Parameter:
 * - Tidak ada parameter langsung, namun menggunakan dependensi dari modul lain.
 *
 * Output:
 * - Mendaftarkan provider dan controller yang berkaitan dengan otentikasi.
 */
@Module({
  imports: [
    /**
     * Registrasi modul JWT secara asinkron.
     *
     * Konfigurasi JWT diambil dari environment variable melalui ConfigService.
     * JWT digunakan untuk proses otentikasi dan verifikasi pengguna.
     */
    JwtModule.registerAsync({
      imports: [ConfigModule],
      /**
       * Fungsi factory untuk konfigurasi JWT.
       *
       * Parameter:
       * - config (ConfigService): Service untuk mengambil konfigurasi aplikasi.
       *
       * Return:
       * - Object konfigurasi JWT (secret dan signOptions).
       */
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET', 'devsecret'),
        signOptions: { expiresIn: '1d' }, // Token berlaku selama 1 hari
      }),
      inject: [ConfigService],
    }),
    UserModule, // Modul pengguna untuk proses otentikasi dan verifikasi data pengguna
  ],
  providers: [
    AuthService, // Service utama untuk logika otentikasi
    JwtStrategy, // Strategi JWT untuk validasi token
  ],
  controllers: [
    AuthController, // Controller untuk endpoint otentikasi (login, register, dll)
  ],
})
export class AuthModule {}
