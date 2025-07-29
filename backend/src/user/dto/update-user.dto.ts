import { IsString, IsOptional, IsIn, IsBoolean } from 'class-validator';

/**
 * DTO untuk memperbarui data pengguna.
 *
 * Digunakan untuk validasi data saat melakukan update pada entitas User.
 * Setiap properti bersifat opsional, sehingga hanya data yang ingin diubah saja yang perlu dikirimkan.
 */
export class UpdateUserDto {
  /**
   * Nama lengkap pengguna.
   * @type {string}
   * @optional
   */
  @IsString()
  @IsOptional()
  nama?: string;

  /**
   * Password baru pengguna.
   * @type {string}
   * @optional
   */
  @IsString()
  @IsOptional()
  password?: string;

  /**
   * Peran pengguna dalam sistem.
   * Hanya dapat bernilai 'admin' atau 'pegawai'.
   * @type {'admin' | 'pegawai'}
   * @optional
   */
  @IsString()
  @IsIn(['admin', 'pegawai'])
  @IsOptional()
  role?: 'admin' | 'pegawai';

  /**
   * Unit kerja pengguna.
   * @type {string}
   * @optional
   */
  @IsString()
  @IsOptional()
  unit_kerja?: string;

  /**
   * Status aktif pengguna.
   * True jika aktif, false jika tidak.
   * @type {boolean}
   * @optional
   */
  @IsBoolean()
  @IsOptional()
  status_aktif?: boolean;

  /**
   * URL atau path foto pengguna.
   * @type {string}
   * @optional
   */
  @IsString()
  @IsOptional()
  foto?: string;
}
