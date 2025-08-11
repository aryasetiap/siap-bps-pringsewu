/**
 * app.service.ts
 *
 * Service utama aplikasi SIAP-BPS Pringsewu.
 *
 * Kelas ini menyediakan layanan utama yang dapat digunakan oleh controller,
 * seperti pengelolaan barang, permintaan, dan verifikasi.
 */

import { Injectable } from '@nestjs/common';

/**
 * Kelas AppService
 *
 * Kelas ini bertanggung jawab menyediakan layanan utama aplikasi SIAP.
 *
 * Contoh layanan: mengembalikan pesan sapaan, pengelolaan data barang, permintaan, dan verifikasi.
 */
@Injectable()
export class AppService {
  /**
   * Fungsi getHello
   *
   * Fungsi ini digunakan untuk mengembalikan pesan sapaan sederhana sebagai indikator aplikasi berjalan.
   *
   * Parameter:
   * - Tidak ada
   *
   * Return:
   * - string: Pesan sapaan "Hello World!".
   */
  getHello(): string {
    return 'Hello World!';
  }
}
