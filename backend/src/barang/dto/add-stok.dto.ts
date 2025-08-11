/**
 * File: add-stok.dto.ts
 *
 * DTO ini digunakan dalam aplikasi SIAP untuk menambah stok barang pada sistem pengelolaan barang.
 * DTO (Data Transfer Object) ini memastikan data yang diterima sesuai validasi bisnis, yaitu jumlah stok harus bilangan bulat dan minimal 1.
 */

import { IsInt, Min } from 'class-validator';

/**
 * Kelas AddStokDto digunakan untuk memvalidasi data penambahan stok barang.
 *
 * Properti:
 * - jumlah (number): Jumlah stok yang akan ditambahkan ke sistem.
 *   Validasi: Harus bilangan bulat dan minimal bernilai 1.
 *
 * Contoh penggunaan:
 * Digunakan pada endpoint penambahan stok barang untuk memastikan data yang masuk valid sebelum diproses lebih lanjut.
 */
export class AddStokDto {
  /**
   * Properti jumlah merepresentasikan jumlah stok barang yang akan ditambahkan.
   *
   * Validasi:
   * - Harus bertipe number (bilangan bulat).
   * - Minimal bernilai 1 (tidak boleh kurang dari 1).
   */
  @IsInt()
  @Min(1)
  jumlah: number;
}
