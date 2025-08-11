/**
 * File pengujian unit untuk AppController pada aplikasi SIAP.
 *
 * Tujuan:
 * - Memastikan AppController dapat diinisialisasi dengan benar.
 * - Memastikan fungsi getHello() mengembalikan nilai yang diharapkan.
 *
 * Konteks bisnis:
 * Pada aplikasi SIAP (Sistem Informasi Administrasi Pengelolaan Barang),
 * AppController bertanggung jawab sebagai entry point untuk permintaan utama,
 * seperti pengecekan status layanan.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * Kelas pengujian unit untuk AppController.
 *
 * Tujuan:
 * - Melakukan inisialisasi modul pengujian.
 * - Menguji fungsi utama pada AppController.
 */
describe('AppController', () => {
  let appController: AppController;

  /**
   * Fungsi inisialisasi sebelum setiap pengujian.
   *
   * Parameter: Tidak ada.
   *
   * Return: Promise<void>
   * - Melakukan setup modul pengujian dan mendapatkan instance AppController.
   */
  beforeEach(async (): Promise<void> => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = testingModule.get<AppController>(AppController);
  });

  /**
   * Pengujian fungsi root pada AppController.
   *
   * Konteks bisnis:
   * Fungsi getHello() digunakan untuk memastikan layanan SIAP berjalan
   * dan dapat menerima permintaan dasar.
   */
  describe('root', () => {
    /**
     * Fungsi pengujian untuk memastikan getHello() mengembalikan string yang diharapkan.
     *
     * Parameter: Tidak ada.
     *
     * Return: void
     * - Melakukan assertion terhadap output fungsi getHello().
     */
    it('should return "Hello World!"', (): void => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
