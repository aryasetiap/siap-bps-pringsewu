import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsIn(['admin', 'pegawai'])
  @IsOptional()
  role?: 'admin' | 'pegawai';

  @IsString()
  @IsOptional()
  unit_kerja?: string;
}
