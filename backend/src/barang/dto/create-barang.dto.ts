import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateBarangDto {
  @IsString()
  @IsNotEmpty()
  kode_barang: string;

  @IsString()
  @IsNotEmpty()
  nama_barang: string;

  @IsString()
  @IsOptional()
  deskripsi?: string;

  @IsString()
  @IsNotEmpty()
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
  foto?: string;
}
