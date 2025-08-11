/**
 * File utama aplikasi SIAP-BPS-Pringsewu.
 *
 * Digunakan untuk inisialisasi aplikasi NestJS, konfigurasi middleware, validasi,
 * penyajian file statis, serta pengaturan folder upload untuk pengelolaan data barang, permintaan, dan verifikasi.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Fungsi bootstrap digunakan untuk memulai aplikasi SIAP.
 *
 * Parameter: Tidak ada.
 *
 * Return:
 * - Promise<void>: Menjalankan server aplikasi pada port yang ditentukan.
 */
async function bootstrap(): Promise<void> {
  // Membuat instance aplikasi NestJS dengan konfigurasi Express
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Menetapkan prefix global untuk seluruh endpoint API
  app.setGlobalPrefix('api');

  /**
   * Mengaktifkan global validation pipe untuk validasi request.
   * - whitelist: hanya properti yang didefinisikan pada DTO yang diterima.
   * - forbidNonWhitelisted: menolak properti yang tidak didefinisikan.
   * - transform: mengubah payload menjadi tipe data yang sesuai DTO.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /**
   * Menyajikan file statis dari folder uploads.
   * Digunakan untuk pengelolaan dokumen barang, permintaan, dan verifikasi.
   */
  app.useStaticAssets(path.join(__dirname, 'uploads'), {
    prefix: '/uploads/',
  });

  // Inisialisasi reflector untuk kebutuhan guard dan metadata (jika diperlukan)
  const reflector = app.get(Reflector);

  /**
   * Memastikan folder uploads/profile tersedia untuk penyimpanan file profil pengguna.
   * Jika folder belum ada, maka akan dibuat secara rekursif.
   */
  const profileUploadDir = path.join(__dirname, 'uploads', 'profile');
  if (!fs.existsSync(profileUploadDir)) {
    fs.mkdirSync(profileUploadDir, { recursive: true });
  }

  // Menjalankan server pada port 3001
  await app.listen(3001);
}

// Menjalankan fungsi bootstrap untuk memulai aplikasi
bootstrap();
