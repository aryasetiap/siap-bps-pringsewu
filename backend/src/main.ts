import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesGuard } from './auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

/**
 * Fungsi utama untuk memulai aplikasi NestJS.
 *
 * Tujuan:
 * - Membuat instance aplikasi NestJS dengan konfigurasi Express.
 * - Mengatur global validation pipe untuk validasi request.
 * - Menyajikan file statis dari folder uploads.
 * - Mengaktifkan global guard untuk otorisasi berbasis peran.
 * - Memastikan folder uploads/profile tersedia untuk penyimpanan file.
 * - Menjalankan server pada port yang ditentukan di environment variable atau default 3000.
 *
 * Parameter: Tidak ada.
 * Nilai Kembali: Promise<void>
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useStaticAssets(path.join(__dirname, 'uploads'), {
    prefix: '/uploads/',
  });

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(), new RolesGuard(reflector));

  const uploadDir = path.join(__dirname, 'uploads', 'profile');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
