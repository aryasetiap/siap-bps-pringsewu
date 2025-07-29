import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permintaan } from '../entities/permintaan.entity';
import { DetailPermintaan } from '../entities/detail_permintaan.entity';
import { Barang } from '../entities/barang.entity';
import { PermintaanController } from './permintaan.controller';
import { PermintaanService } from './permintaan.service';

/**
 * Modul Permintaan
 *
 * Modul ini bertanggung jawab untuk mengelola fitur permintaan,
 * termasuk pengaturan controller dan service yang berkaitan dengan permintaan.
 *
 * Import:
 * - Entity Permintaan, DetailPermintaan, dan Barang untuk kebutuhan database.
 * - Controller dan Service terkait permintaan.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Permintaan, DetailPermintaan, Barang])],
  controllers: [PermintaanController],
  providers: [PermintaanService],
})
export class PermintaanModule {}
