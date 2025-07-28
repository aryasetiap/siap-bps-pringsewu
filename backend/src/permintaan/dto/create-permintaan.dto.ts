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

class PermintaanItemDto {
  @IsInt()
  @Min(1)
  id_barang: number;

  @IsInt()
  @Min(1)
  jumlah: number;
}

export class CreatePermintaanDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermintaanItemDto)
  items: PermintaanItemDto[];

  @IsOptional()
  @IsString()
  catatan?: string;
}
