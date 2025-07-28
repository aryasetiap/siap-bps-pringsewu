import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Matches,
  MaxLength,
} from 'class-validator';

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
