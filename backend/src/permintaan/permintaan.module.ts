/**
 * permintaan.module.ts
 *
 * Modul ini digunakan untuk mengelola fitur permintaan barang pada aplikasi SIAP.
 * Modul ini mengatur integrasi antara entity, controller, dan service yang berkaitan
 * dengan proses permintaan, detail permintaan, barang, dan user.
 *
 * Parameter:
 * - Tidak ada parameter langsung pada modul ini.
 *
 * Return:
 * - PermintaanModule: Modul yang siap digunakan oleh aplikasi utama.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permintaan } from '../entities/permintaan.entity';
import { DetailPermintaan } from '../entities/detail_permintaan.entity';
import { Barang } from '../entities/barang.entity';
import { User } from '../entities/user.entity';
import { PermintaanController } from './permintaan.controller';
import { PermintaanService } from './permintaan.service';

/**
 * PermintaanModule
 *
 * Modul utama untuk fitur permintaan barang.
 * Menghubungkan entity Permintaan, DetailPermintaan, Barang, dan User
 * dengan controller serta service yang menangani logika bisnis permintaan barang.
 *
 * Parameter:
 * - Tidak ada parameter langsung.
 *
 * Return:
 * - PermintaanModule: Modul yang dapat diimport ke modul utama aplikasi SIAP.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permintaan, // Entity utama permintaan barang
      DetailPermintaan, // Entity detail permintaan barang
      Barang, // Entity barang yang diminta
      User, // Entity user yang melakukan permintaan
    ]),
  ],
  controllers: [PermintaanController], // Controller untuk permintaan barang
  providers: [PermintaanService], // Service untuk logika bisnis permintaan barang
})
export class PermintaanModule {}
