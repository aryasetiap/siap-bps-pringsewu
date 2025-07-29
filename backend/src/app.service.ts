import { Injectable } from '@nestjs/common';

/**
 * Service utama aplikasi.
 *
 * Kelas ini menyediakan berbagai layanan utama yang dapat digunakan oleh controller.
 */
@Injectable()
export class AppService {
  /**
   * Mengembalikan pesan sapaan sederhana.
   *
   * @returns {string} Pesan sapaan "Hello World!".
   */
  getHello(): string {
    return 'Hello World!';
  }
}
