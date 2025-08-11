/**
 * File: permintaan.entity.ts
 *
 * Entitas Permintaan pada aplikasi SIAP.
 *
 * Digunakan untuk merepresentasikan permintaan data barang yang diajukan oleh pengguna,
 * termasuk informasi pemohon, status permintaan, verifikasi, dan detail permintaan terkait.
 *
 * Parameter:
 * - Tidak ada parameter pada file ini.
 *
 * Return:
 * - Tidak ada return pada file ini.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { DetailPermintaan } from './detail_permintaan.entity';

/**
 * Class Permintaan
 *
 * Merepresentasikan permintaan data barang yang diajukan oleh pengguna.
 * Setiap permintaan memiliki pemohon, status, catatan, verifikator, serta daftar detail permintaan.
 *
 * Parameter:
 * - Tidak ada parameter pada class ini.
 *
 * Return:
 * - Instance dari entitas Permintaan.
 */
@Entity('permintaan')
export class Permintaan {
  /**
   * Primary key permintaan (auto increment).
   *
   * Parameter:
   * - Tidak ada.
   *
   * Return:
   * - number: ID unik permintaan.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * ID pengguna yang mengajukan permintaan.
   *
   * Parameter:
   * - Tidak ada.
   *
   * Return:
   * - number: ID user pemohon.
   */
  @Column()
  id_user_pemohon: number;

  /**
   * Relasi ke entitas User sebagai pemohon.
   *
   * Parameter:
   * - Tidak ada.
   *
   * Return:
   * - User: Data user pemohon.
   */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_user_pemohon' })
  pemohon: User;

  /**
   * Tanggal permintaan diajukan.
   * Default: waktu saat data dibuat.
   *
   * Parameter:
   * - Tidak ada.
   *
   * Return:
   * - Date: Tanggal permintaan.
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  tanggal_permintaan: Date;

  /**
   * Status permintaan.
   * Nilai: 'Menunggu', 'Disetujui', 'Disetujui Sebagian', atau 'Ditolak'.
   * Default: 'Menunggu'.
   *
   * Parameter:
   * - Tidak ada.
   *
   * Return:
   * - string: Status permintaan.
   */
  @Column({ default: 'Menunggu' })
  status: 'Menunggu' | 'Disetujui' | 'Disetujui Sebagian' | 'Ditolak';

  /**
   * Catatan tambahan terkait permintaan (opsional).
   *
   * Parameter:
   * - Tidak ada.
   *
   * Return:
   * - string: Catatan permintaan.
   */
  @Column({ nullable: true })
  catatan?: string;

  /**
   * ID user verifikator yang memproses permintaan (opsional).
   *
   * Parameter:
   * - Tidak ada.
   *
   * Return:
   * - number: ID user verifikator.
   */
  @Column({ nullable: true })
  id_user_verifikator?: number;

  /**
   * Tanggal permintaan diverifikasi (opsional).
   *
   * Parameter:
   * - Tidak ada.
   *
   * Return:
   * - Date: Tanggal verifikasi permintaan.
   */
  @Column({ type: 'timestamp', nullable: true })
  tanggal_verifikasi?: Date;

  /**
   * Tanggal data permintaan dibuat (otomatis oleh sistem).
   *
   * Parameter:
   * - Tidak ada.
   *
   * Return:
   * - Date: Tanggal pembuatan data permintaan.
   */
  @CreateDateColumn()
  created_at: Date;

  /**
   * Tanggal data permintaan terakhir diubah (otomatis oleh sistem).
   *
   * Parameter:
   * - Tidak ada.
   *
   * Return:
   * - Date: Tanggal update data permintaan.
   */
  @UpdateDateColumn()
  updated_at: Date;

  /**
   * Daftar detail permintaan yang terkait dengan permintaan ini.
   *
   * Parameter:
   * - Tidak ada.
   *
   * Return:
   * - DetailPermintaan[]: Array detail permintaan.
   */
  @OneToMany(() => DetailPermintaan, (detail) => detail.permintaan)
  details: DetailPermintaan[];
}
