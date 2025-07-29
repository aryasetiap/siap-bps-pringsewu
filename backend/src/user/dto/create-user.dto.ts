import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

/**
 * DTO untuk membuat user baru.
 *
 * Digunakan untuk validasi data saat pembuatan user.
 *
 * Properti:
 * - nama: Nama lengkap user (wajib diisi)
 * - username: Username unik untuk login (wajib diisi)
 * - password: Password user (wajib diisi)
 * - role: Peran user, hanya bisa 'admin' atau 'pegawai' (opsional)
 * - unit_kerja: Unit kerja user (opsional)
 * - foto: URL atau path foto user (opsional)
 */
export class CreateUserDto {
  /**
   * Nama lengkap user.
   */
  @IsString()
  @IsNotEmpty()
  nama: string;

  /**
   * Username unik untuk login.
   */
  @IsString()
  @IsNotEmpty()
  username: string;

  /**
   * Password user.
   */
  @IsString()
  @IsNotEmpty()
  password: string;

  /**
   * Peran user, hanya bisa 'admin' atau 'pegawai'.
   */
  @IsString()
  @IsIn(['admin', 'pegawai'])
  @IsOptional()
  role?: 'admin' | 'pegawai';

  /**
   * Unit kerja user.
   */
  @IsString()
  @IsOptional()
  unit_kerja?: string;

  /**
   * URL atau path foto user.
   */
  @IsString()
  @IsOptional()
  foto?: string;
}
