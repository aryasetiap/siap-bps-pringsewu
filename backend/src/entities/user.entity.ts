/**
 * File: user.entity.ts
 *
 * Entitas User digunakan untuk merepresentasikan data pengguna dalam aplikasi SIAP.
 * Entitas ini berperan penting dalam pengelolaan akses, permintaan barang, dan proses verifikasi.
 *
 * Setiap properti pada entitas ini menggambarkan atribut yang dimiliki oleh pengguna,
 * seperti identitas, peran, unit kerja, status aktif, dan informasi profil.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Kelas User merepresentasikan data pengguna pada sistem SIAP.
 *
 * Properti:
 * - id (number): Primary key, auto increment.
 * - nama (string): Nama lengkap pengguna.
 * - username (string): Username unik untuk login pengguna.
 * - password (string): Password pengguna (diharapkan sudah di-hash).
 * - role ('admin' | 'pegawai'): Peran pengguna dalam sistem, default 'pegawai'.
 * - unit_kerja (string | null): Unit kerja pengguna, opsional.
 * - status_aktif (boolean): Status aktif pengguna, default true.
 * - created_at (Date): Tanggal dan waktu pembuatan data pengguna.
 * - updated_at (Date): Tanggal dan waktu terakhir data pengguna diperbarui.
 * - foto (string | null): URL atau path foto profil pengguna, opsional.
 *
 * Catatan:
 * - Properti 'role' digunakan untuk membedakan hak akses pengguna, misal admin dapat melakukan verifikasi permintaan barang.
 * - Properti 'unit_kerja' memudahkan pelacakan permintaan barang berdasarkan unit kerja.
 */
@Entity('users')
export class User {
  /** Primary key, auto increment. */
  @PrimaryGeneratedColumn()
  id: number;

  /** Nama lengkap pengguna. */
  @Column()
  nama: string;

  /** Username unik untuk login pengguna. */
  @Column({ unique: true })
  username: string;

  /** Password pengguna (diharapkan sudah di-hash sebelum disimpan). */
  @Column()
  password: string;

  /**
   * Peran pengguna dalam sistem.
   * Nilai yang diperbolehkan: 'admin' atau 'pegawai'.
   * Default: 'pegawai'.
   *
   * 'admin' memiliki hak akses lebih untuk verifikasi dan pengelolaan barang.
   * 'pegawai' hanya dapat melakukan permintaan barang.
   */
  @Column({ type: 'enum', enum: ['admin', 'pegawai'], default: 'pegawai' })
  role: 'admin' | 'pegawai';

  /**
   * Unit kerja pengguna.
   * Opsional, digunakan untuk mengelompokkan permintaan barang berdasarkan unit kerja.
   */
  @Column({ nullable: true })
  unit_kerja?: string;

  /**
   * Status aktif pengguna.
   * Jika false, pengguna tidak dapat mengakses sistem.
   * Default: true.
   */
  @Column({ default: true })
  status_aktif: boolean;

  /** Tanggal dan waktu pembuatan data pengguna. */
  @CreateDateColumn()
  created_at: Date;

  /** Tanggal dan waktu terakhir data pengguna diperbarui. */
  @UpdateDateColumn()
  updated_at: Date;

  /**
   * URL atau path foto profil pengguna.
   * Opsional, digunakan untuk menampilkan foto pada dashboard SIAP.
   */
  @Column({ nullable: true })
  foto?: string;
}
