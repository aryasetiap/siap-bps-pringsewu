/**
 * File: create-barang.dto.ts
 *
 * DTO (Data Transfer Object) untuk entitas Barang pada aplikasi SIAP.
 * Digunakan untuk validasi data saat proses pembuatan barang baru di sistem SIAP,
 * yang berfungsi untuk pengelolaan inventaris, permintaan, dan verifikasi barang.
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Matches,
  MaxLength,
} from 'class-validator';

/**
 * Kelas CreateBarangDto digunakan untuk memvalidasi data input saat membuat barang baru.
 *
 * Properti:
 * - kode_barang (string): Kode unik barang, hanya boleh huruf, angka, dan strip, maksimal 20 karakter.
 * - nama_barang (string): Nama barang, wajib diisi, maksimal 100 karakter.
 * - deskripsi (string, opsional): Deskripsi tambahan mengenai barang, maksimal 255 karakter.
 * - satuan (string): Satuan barang, wajib diisi, maksimal 20 karakter.
 * - stok (number, opsional): Jumlah stok barang, minimal 0.
 * - ambang_batas_kritis (number, opsional): Ambang batas stok kritis, minimal 0.
 * - foto (string, opsional): URL atau path foto barang, maksimal 255 karakter.
 * - kategori (string, opsional): Kategori barang, maksimal 50 karakter.
 *
 * Output:
 * - Objek DTO yang tervalidasi sesuai kebutuhan bisnis aplikasi SIAP.
 */
export class CreateBarangDto {
  /**
   * Kode unik barang.
   * Hanya boleh huruf, angka, dan strip, maksimal 20 karakter.
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9\-]+$/, {
    message: 'Kode hanya boleh huruf, angka, dan strip',
  })
  @MaxLength(20)
  kode_barang: string;

  /**
   * Nama barang.
   * Wajib diisi, maksimal 100 karakter.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nama_barang: string;

  /**
   * Deskripsi tambahan mengenai barang.
   * Opsional, maksimal 255 karakter.
   */
  @IsString()
  @IsOptional()
  @MaxLength(255)
  deskripsi?: string;

  /**
   * Satuan barang.
   * Wajib diisi, maksimal 20 karakter.
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  satuan: string;

  /**
   * Jumlah stok barang.
   * Opsional, minimal 0.
   */
  @IsInt()
  @Min(0)
  @IsOptional()
  stok?: number;

  /**
   * Ambang batas stok kritis.
   * Opsional, minimal 0.
   * Digunakan untuk verifikasi stok minimum barang.
   */
  @IsInt()
  @Min(0)
  @IsOptional()
  ambang_batas_kritis?: number;

  /**
   * URL atau path foto barang.
   * Opsional, maksimal 255 karakter.
   */
  @IsString()
  @IsOptional()
  @MaxLength(255)
  foto?: string;

  /**
   * Kategori barang.
   * Opsional, maksimal 50 karakter.
   */
  @IsString()
  @IsOptional()
  @MaxLength(50)
  kategori?: string;
}
