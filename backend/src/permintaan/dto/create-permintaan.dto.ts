/**
 * File: create-permintaan.dto.ts
 *
 * Modul DTO untuk fitur permintaan barang pada aplikasi SIAP.
 *
 * Digunakan untuk memvalidasi data permintaan barang yang masuk,
 * memastikan setiap item dan catatan sesuai dengan aturan bisnis SIAP.
 */

import {
  IsArray,
  IsInt,
  IsNotEmpty,
  Min,
  ValidateNested,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Kelas DTO untuk satu item permintaan barang.
 *
 * Fungsi:
 * - Memvalidasi data setiap item yang diminta dalam permintaan barang.
 *
 * Parameter:
 * - id_barang (number): ID barang yang diminta, harus bilangan bulat dan minimal 1.
 * - jumlah (number): Jumlah barang yang diminta, harus bilangan bulat dan minimal 1.
 *
 * Return:
 * - PermintaanItemDto: Objek DTO yang tervalidasi untuk satu item permintaan.
 */
export class PermintaanItemDto {
  /** ID barang yang diminta, wajib diisi dan minimal bernilai 1 */
  @IsInt()
  @Min(1)
  id_barang: number;

  /** Jumlah barang yang diminta, wajib diisi dan minimal bernilai 1 */
  @IsInt()
  @Min(1)
  jumlah: number;
}

/**
 * Kelas DTO untuk membuat permintaan barang baru.
 *
 * Fungsi:
 * - Memvalidasi data permintaan barang yang masuk,
 *   termasuk daftar item permintaan dan catatan tambahan.
 *
 * Parameter:
 * - items (PermintaanItemDto[]): Daftar item barang yang diminta, wajib diisi.
 * - catatan (string, optional): Catatan tambahan terkait permintaan, opsional.
 *
 * Return:
 * - CreatePermintaanDto: Objek DTO yang tervalidasi untuk permintaan barang baru.
 */
export class CreatePermintaanDto {
  /**
   * Daftar item barang yang diminta.
   *
   * Validasi:
   * - Harus berupa array.
   * - Setiap elemen harus berupa PermintaanItemDto yang tervalidasi.
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermintaanItemDto)
  items: PermintaanItemDto[];

  /**
   * Catatan tambahan terkait permintaan barang.
   *
   * Validasi:
   * - Opsional.
   * - Jika diisi, harus berupa string.
   */
  @IsOptional()
  @IsString()
  catatan?: string;
}
