/**
 * File: app.module.ts
 *
 * Modul utama aplikasi SIAP-BPS Pringsewu.
 *
 * Modul ini bertanggung jawab untuk menginisialisasi seluruh modul fitur,
 * konfigurasi environment, serta koneksi database PostgreSQL.
 *
 * Aplikasi SIAP digunakan untuk pengelolaan barang, permintaan barang, dan verifikasi pengguna.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BarangModule } from './barang/barang.module';
import { PermintaanModule } from './permintaan/permintaan.module';

/**
 * Kelas AppModule merupakan modul utama aplikasi SIAP.
 *
 * Kelas ini mengatur inisialisasi modul konfigurasi, koneksi database,
 * serta mengimpor seluruh modul fitur aplikasi seperti autentikasi, user,
 * barang, dan permintaan.
 */
@Module({
  imports: [
    /**
     * Inisialisasi modul konfigurasi global.
     *
     * Parameter:
     * - isGlobal (boolean): Menjadikan konfigurasi tersedia di seluruh aplikasi.
     */
    ConfigModule.forRoot({ isGlobal: true }),

    /**
     * Inisialisasi koneksi database PostgreSQL menggunakan TypeORM.
     *
     * Parameter:
     * - type (string): Jenis database yang digunakan.
     * - host (string): Host database.
     * - port (number): Port database.
     * - username (string): Username database.
     * - password (string): Password database.
     * - database (string): Nama database.
     * - autoLoadEntities (boolean): Otomatis memuat entitas.
     * - synchronize (boolean): Sinkronisasi skema database (false di production).
     *
     * Return:
     * - TypeOrmModule: Modul koneksi database.
     */
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true, // Ubah ke false pada production
    }),

    /**
     * Modul-modul fitur aplikasi SIAP:
     * - AuthModule: Modul autentikasi dan otorisasi pengguna.
     * - UserModule: Modul pengelolaan data pengguna.
     * - BarangModule: Modul pengelolaan data barang.
     * - PermintaanModule: Modul pengelolaan permintaan barang.
     */
    AuthModule,
    UserModule,
    BarangModule,
    PermintaanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  /**
   * Konstruktor AppModule.
   *
   * Fungsi ini digunakan untuk menginisialisasi modul utama aplikasi SIAP.
   *
   * Tidak menerima parameter dan tidak mengembalikan nilai.
   */
  constructor() {}
}
