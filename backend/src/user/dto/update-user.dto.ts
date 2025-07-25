import { IsString, IsOptional, IsIn, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nama?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsIn(['admin', 'pegawai'])
  @IsOptional()
  role?: 'admin' | 'pegawai';

  @IsString()
  @IsOptional()
  unit_kerja?: string;

  @IsBoolean()
  @IsOptional()
  status_aktif?: boolean;
}
