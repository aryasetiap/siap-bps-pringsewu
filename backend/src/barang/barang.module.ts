import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barang } from '../entities/barang.entity';
import { BarangService } from './barang.service';
import { BarangController } from './barang.controller';

/**
 * Modul Barang
 *
 * Modul ini digunakan untuk mengelola fitur terkait entitas Barang,
 * termasuk service dan controller yang berhubungan.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Barang])],
  controllers: [BarangController],
  providers: [BarangService],
})
export class BarangModule {}
