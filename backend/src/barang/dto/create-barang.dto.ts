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
 * DTO untuk membuat entitas Barang baru.
 *
 * Digunakan untuk validasi data saat membuat barang baru di sistem.
 * Setiap properti memiliki validasi sesuai kebutuhan bisnis.
 *
 * Properti:
 * - kode_barang: Kode unik barang, hanya boleh huruf, angka, dan strip, maksimal 20 karakter.
 * - nama_barang: Nama barang, wajib diisi, maksimal 100 karakter.
 * - deskripsi: Deskripsi tambahan mengenai barang, opsional, maksimal 255 karakter.
 * - satuan: Satuan barang, wajib diisi, maksimal 20 karakter.
 * - stok: Jumlah stok barang, opsional, minimal 0.
 * - ambang_batas_kritis: Ambang batas stok kritis, opsional, minimal 0.
 * - foto: URL atau path foto barang, opsional, maksimal 255 karakter.
 */
export class CreateBarangDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9\-]+$/, {
    message: 'Kode hanya boleh huruf, angka, dan strip',
  })
  @MaxLength(20)
  kode_barang: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nama_barang: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  deskripsi?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  satuan: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  stok?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  ambang_batas_kritis?: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  foto?: string;
}
