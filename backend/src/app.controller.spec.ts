import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * Pengujian unit untuk AppController.
 *
 * Tujuan:
 * - Memastikan AppController dapat diinisialisasi dengan benar.
 * - Memastikan fungsi getHello() mengembalikan nilai yang diharapkan.
 */
describe('AppController', () => {
  let appController: AppController;

  /**
   * Inisialisasi modul pengujian dan instance AppController sebelum setiap pengujian dijalankan.
   *
   * Tidak menerima parameter.
   * Tidak mengembalikan nilai.
   */
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  /**
   * Pengujian untuk fungsi root (getHello).
   *
   * Memastikan bahwa fungsi getHello() mengembalikan string "Hello World!".
   */
  describe('root', () => {
    /**
     * Pengujian nilai kembalian dari fungsi getHello().
     *
     * Tidak menerima parameter.
     * Tidak mengembalikan nilai.
     */
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
