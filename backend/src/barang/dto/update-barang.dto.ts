/**
 * File: update-barang.dto.ts
 *
 * Data Transfer Object (DTO) untuk memperbarui data Barang pada aplikasi SIAP.
 *
 * DTO ini digunakan dalam proses pengelolaan barang, khususnya saat melakukan
 * pembaruan data barang yang sudah ada. Dengan menggunakan PartialType, semua
 * properti dari CreateBarangDto menjadi opsional, sehingga memungkinkan
 * pembaruan parsial pada entitas Barang.
 */

import { PartialType } from '@nestjs/mapped-types';
import { CreateBarangDto } from './create-barang.dto';
import { IsOptional, IsBoolean } from 'class-validator';

/**
 * Kelas UpdateBarangDto digunakan untuk menerima data pembaruan barang.
 *
 * Parameter:
 * - status_aktif (boolean, opsional): Menandakan apakah barang masih aktif
 *   dalam sistem SIAP. Nilai true berarti barang aktif, false berarti tidak aktif.
 *
 * Output:
 * - Objek DTO yang berisi data pembaruan barang, dengan semua properti dari
 *   CreateBarangDto menjadi opsional, serta tambahan properti status_aktif.
 */
export class UpdateBarangDto extends PartialType(CreateBarangDto) {
  /**
   * Properti status_aktif digunakan untuk menandai status keaktifan barang.
   * Properti ini opsional dan hanya perlu diisi jika ingin mengubah status barang.
   */
  @IsOptional()
  @IsBoolean()
  status_aktif?: boolean;
}
