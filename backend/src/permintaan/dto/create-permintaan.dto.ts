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
 * DTO untuk item permintaan.
 * 
 * Digunakan untuk memvalidasi data setiap item yang diminta.
 * 
 * @property {number} id_barang - ID barang yang diminta (harus bilangan bulat dan minimal 1).
 * @property {number} jumlah - Jumlah barang yang diminta (harus bilangan bulat dan minimal 1).
 */
class PermintaanItemDto {
  @IsInt()
  @Min(1)
  id_barang: number;

  @IsInt()
  @Min(1)
  jumlah: number;
}

/**
 * DTO untuk membuat permintaan baru.
 * 
 * Digunakan untuk memvalidasi data permintaan yang masuk, termasuk daftar item dan catatan opsional.
 * 
 * @property {PermintaanItemDto[]} items - Daftar item yang diminta.
 * @property {string} [catatan] - Catatan tambahan terkait permintaan (opsional).
 */
export class CreatePermintaanDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermintaanItemDto)
  items: PermintaanItemDto[];

  @IsOptional()
  @IsString()
  catatan?: string;
}
