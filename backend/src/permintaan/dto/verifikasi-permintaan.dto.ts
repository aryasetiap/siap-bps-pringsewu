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

class VerifikasiItemDto {
  @IsInt()
  id_detail: number;

  @IsInt()
  @Min(0)
  jumlah_disetujui: number;
}

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
