import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Controller utama untuk menangani permintaan HTTP ke aplikasi.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Mengembalikan pesan sapaan dari service aplikasi.
   *
   * @returns {string} Pesan sapaan yang dihasilkan oleh AppService.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
