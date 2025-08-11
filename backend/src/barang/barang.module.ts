/**
 * File: barang.module.ts
 * Modul Barang untuk aplikasi SIAP-BPS Pringsewu.
 *
 * Modul ini bertanggung jawab untuk mengelola fitur terkait entitas Barang,
 * termasuk service dan controller yang berhubungan dengan pengelolaan data barang,
 * permintaan barang, dan proses verifikasi barang.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barang } from '../entities/barang.entity';
import { BarangService } from './barang.service';
import { BarangController } from './barang.controller';

/**
 * BarangModule
 *
 * Kelas ini merupakan modul utama untuk pengelolaan barang pada aplikasi SIAP.
 * Modul ini mengimpor entitas Barang, serta menyediakan controller dan service
 * yang berkaitan dengan proses bisnis barang.
 *
 * Parameter:
 * - Tidak ada parameter.
 *
 * Return:
 * - BarangModule: Modul yang siap digunakan oleh aplikasi utama.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Barang])],
  controllers: [BarangController],
  providers: [BarangService],
})
export class BarangModule {}
