/**
 * DTO Verifikasi Permintaan Barang SIAP
 *
 * File ini berisi Data Transfer Object (DTO) yang digunakan untuk proses verifikasi permintaan barang
 * pada aplikasi SIAP. DTO ini memastikan data yang diterima sesuai dengan kebutuhan bisnis, seperti
 * keputusan verifikasi, daftar item yang diverifikasi, dan catatan tambahan.
 */

import {
  IsArray,
  IsInt,
  Min,
  ValidateNested,
  IsEnum,
  IsOptional,
  IsString,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Kelas VerifikasiItemDto
 *
 * DTO ini digunakan untuk memvalidasi setiap detail item permintaan barang yang akan diverifikasi.
 *
 * Parameter:
 * - id_detail (number): ID detail permintaan barang yang diverifikasi.
 * - jumlah_disetujui (number): Jumlah barang yang disetujui untuk item ini (minimal 0).
 *
 * Return:
 * - VerifikasiItemDto: Objek DTO detail verifikasi item permintaan barang.
 */
class VerifikasiItemDto {
  /**
   * ID detail permintaan barang yang diverifikasi.
   */
  @IsInt()
  id_detail: number;

  /**
   * Jumlah barang yang disetujui untuk item ini.
   * Nilai minimal adalah 0.
   */
  @IsInt()
  @Min(0)
  jumlah_disetujui: number;
}

/**
 * Kelas VerifikasiPermintaanDto
 *
 * DTO utama untuk proses verifikasi permintaan barang pada aplikasi SIAP.
 * Memvalidasi keputusan verifikasi, daftar item yang diverifikasi, dan catatan tambahan.
 *
 * Parameter:
 * - keputusan ('setuju' | 'sebagian' | 'tolak'): Keputusan hasil verifikasi permintaan barang.
 * - items (VerifikasiItemDto[]): Daftar item permintaan barang yang diverifikasi (minimal 1 item).
 * - catatan_verifikasi (string, opsional): Catatan tambahan terkait proses verifikasi.
 *
 * Return:
 * - VerifikasiPermintaanDto: Objek DTO verifikasi permintaan barang.
 */
export class VerifikasiPermintaanDto {
  /**
   * Keputusan hasil verifikasi permintaan barang.
   * Pilihan: 'setuju', 'sebagian', atau 'tolak'.
   */
  @IsEnum(['setuju', 'sebagian', 'tolak'])
  keputusan: 'setuju' | 'sebagian' | 'tolak';

  /**
   * Daftar item permintaan barang yang diverifikasi.
   * Minimal harus terdapat 1 item.
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VerifikasiItemDto)
  @ArrayMinSize(1, { message: 'items tidak boleh kosong' })
  items: VerifikasiItemDto[];

  /**
   * Catatan tambahan terkait proses verifikasi (opsional).
   */
  @IsOptional()
  @IsString()
  catatan_verifikasi?: string;
}
