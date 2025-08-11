/**
 * File: app.controller.ts
 *
 * Controller utama aplikasi SIAP-BPS Pringsewu.
 *
 * Digunakan untuk menangani permintaan HTTP terkait pengelolaan barang, permintaan, dan verifikasi.
 *
 * Author: [Nama Anda]
 * Date: [Tanggal]
 */

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Kelas AppController
 *
 * Controller utama yang mengatur endpoint root aplikasi SIAP.
 *
 * Parameter:
 * - appService (AppService): Service utama yang menyediakan logika bisnis aplikasi.
 */
@Controller()
export class AppController {
  /**
   * Konstruktor AppController
   *
   * Parameter:
   * - appService (AppService): Dependency injection untuk service aplikasi.
   */
  constructor(private readonly appService: AppService) {}

  /**
   * Endpoint GET /
   *
   * Fungsi ini digunakan untuk mengembalikan pesan sapaan dari aplikasi SIAP.
   * Biasanya digunakan untuk pengecekan status aplikasi atau sebagai landing endpoint.
   *
   * Return:
   * - string: Pesan sapaan yang dihasilkan oleh AppService.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
