import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entitas User merepresentasikan data pengguna dalam sistem.
 * Setiap properti pada entitas ini menggambarkan atribut yang dimiliki oleh pengguna.
 */
@Entity('users')
export class User {
  /**
   * Primary key, auto increment.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Nama lengkap pengguna.
   */
  @Column()
  nama: string;

  /**
   * Username unik untuk login pengguna.
   */
  @Column({ unique: true })
  username: string;

  /**
   * Password pengguna (diharapkan sudah di-hash).
   */
  @Column()
  password: string;

  /**
   * Peran pengguna dalam sistem, default 'pegawai'.
   * Nilai yang diperbolehkan: 'admin' atau 'pegawai'.
   */
  @Column({ default: 'pegawai' })
  role: 'admin' | 'pegawai';

  /**
   * Unit kerja pengguna, opsional.
   */
  @Column({ nullable: true })
  unit_kerja: string;

  /**
   * Status aktif pengguna, default true.
   */
  @Column({ default: true })
  status_aktif: boolean;

  /**
   * Tanggal dan waktu pembuatan data pengguna.
   */
  @CreateDateColumn()
  created_at: Date;

  /**
   * Tanggal dan waktu terakhir data pengguna diperbarui.
   */
  @UpdateDateColumn()
  updated_at: Date;

  /**
   * URL atau path foto profil pengguna, opsional.
   */
  @Column({ nullable: true })
  foto: string;
}
