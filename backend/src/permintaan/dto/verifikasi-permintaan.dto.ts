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
 * DTO untuk item verifikasi permintaan.
 *
 * Digunakan untuk memvalidasi setiap item detail permintaan yang akan diverifikasi.
 *
 * @property {number} id_detail - ID detail permintaan yang diverifikasi.
 * @property {number} jumlah_disetujui - Jumlah yang disetujui untuk item ini (minimal 0).
 */
class VerifikasiItemDto {
  @IsInt()
  id_detail: number;

  @IsInt()
  @Min(0)
  jumlah_disetujui: number;
}

/**
 * DTO untuk verifikasi permintaan.
 *
 * Digunakan untuk memvalidasi data verifikasi permintaan, termasuk keputusan, daftar item, dan catatan opsional.
 *
 * @property {'setuju' | 'sebagian' | 'tolak'} keputusan - Keputusan hasil verifikasi permintaan.
 * @property {VerifikasiItemDto[]} items - Daftar item permintaan yang diverifikasi (minimal 1 item).
 * @property {string} [catatan_verifikasi] - Catatan tambahan terkait verifikasi (opsional).
 */
export class VerifikasiPermintaanDto {
  @IsEnum(['setuju', 'sebagian', 'tolak'])
  keputusan: 'setuju' | 'sebagian' | 'tolak';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VerifikasiItemDto)
  @ArrayMinSize(1, { message: 'items tidak boleh kosong' })
  items: VerifikasiItemDto[];

  @IsOptional()
  @IsString()
  catatan_verifikasi?: string;
}
