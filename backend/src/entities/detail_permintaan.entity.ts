/**
 * File: detail_permintaan.entity.ts
 *
 * Entitas ini digunakan untuk merepresentasikan detail permintaan barang dalam aplikasi SIAP.
 * Setiap detail permintaan berisi referensi ke permintaan utama, barang yang diminta, jumlah permintaan, dan jumlah yang disetujui.
 * Digunakan dalam proses pengelolaan, verifikasi, dan pencatatan permintaan barang di lingkungan SIAP.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Permintaan } from './permintaan.entity';
import { Barang } from './barang.entity';

/**
 * Kelas DetailPermintaan digunakan untuk menyimpan detail dari setiap permintaan barang.
 *
 * Parameter:
 * - id (number): Primary key detail permintaan.
 * - id_permintaan (number): Foreign key ke entitas Permintaan.
 * - permintaan (Permintaan): Relasi ke entitas Permintaan.
 * - id_barang (number): Foreign key ke entitas Barang.
 * - barang (Barang): Relasi ke entitas Barang.
 * - jumlah_diminta (number): Jumlah barang yang diminta.
 * - jumlah_disetujui (number): Jumlah barang yang disetujui (default 0).
 * - created_at (Date): Tanggal dan waktu entri dibuat.
 * - updated_at (Date): Tanggal dan waktu entri terakhir diubah.
 *
 * Return:
 * - DetailPermintaan: Objek entitas detail permintaan barang.
 */
@Entity('detail_permintaan')
export class DetailPermintaan {
  /** Primary key detail permintaan. */
  @PrimaryGeneratedColumn()
  id: number;

  /** Foreign key ke entitas Permintaan. */
  @Column()
  id_permintaan: number;

  /**
   * Relasi ke entitas Permintaan.
   * Setiap detail permintaan terhubung ke satu permintaan utama.
   */
  @ManyToOne(() => Permintaan)
  @JoinColumn({ name: 'id_permintaan' })
  permintaan: Permintaan;

  /** Foreign key ke entitas Barang. */
  @Column()
  id_barang: number;

  /**
   * Relasi ke entitas Barang.
   * Setiap detail permintaan berhubungan dengan satu jenis barang.
   */
  @ManyToOne(() => Barang)
  @JoinColumn({ name: 'id_barang' })
  barang: Barang;

  /** Jumlah barang yang diminta oleh pemohon. */
  @Column()
  jumlah_diminta: number;

  /** Jumlah barang yang disetujui oleh verifikator (default 0). */
  @Column({ default: 0 })
  jumlah_disetujui: number;

  /** Tanggal dan waktu entri dibuat (otomatis oleh sistem). */
  @CreateDateColumn()
  created_at: Date;

  /** Tanggal dan waktu entri terakhir diubah (otomatis oleh sistem). */
  @UpdateDateColumn()
  updated_at: Date;
}
