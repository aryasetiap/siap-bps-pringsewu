import { IsInt, Min } from 'class-validator';

/**
 * DTO untuk menambah stok barang.
 *
 * Properti:
 * - jumlah: Jumlah stok yang akan ditambahkan (harus bilangan bulat dan minimal 1).
 */
export class AddStokDto {
  @IsInt()
  @Min(1)
  jumlah: number;
}
