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
 * Entitas DetailPermintaan merepresentasikan detail dari permintaan barang.
 * Setiap entri berisi referensi ke permintaan, barang, jumlah yang diminta, dan jumlah yang disetujui.
 */
@Entity('detail_permintaan')
export class DetailPermintaan {
  /**
   * Primary key detail permintaan.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Foreign key ke entitas Permintaan.
   */
  @Column()
  id_permintaan: number;

  /**
   * Relasi ke entitas Permintaan.
   * @type {Permintaan}
   */
  @ManyToOne(() => Permintaan)
  @JoinColumn({ name: 'id_permintaan' })
  permintaan: Permintaan;

  /**
   * Foreign key ke entitas Barang.
   */
  @Column()
  id_barang: number;

  /**
   * Relasi ke entitas Barang.
   * @type {Barang}
   */
  @ManyToOne(() => Barang)
  @JoinColumn({ name: 'id_barang' })
  barang: Barang;

  /**
   * Jumlah barang yang diminta.
   */
  @Column()
  jumlah_diminta: number;

  /**
   * Jumlah barang yang disetujui (default 0).
   */
  @Column({ default: 0 })
  jumlah_disetujui: number;

  /**
   * Tanggal dan waktu entri dibuat.
   */
  @CreateDateColumn()
  created_at: Date;

  /**
   * Tanggal dan waktu entri terakhir diubah.
   */
  @UpdateDateColumn()
  updated_at: Date;
}
