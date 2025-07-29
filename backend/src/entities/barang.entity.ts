import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entitas Barang merepresentasikan data barang pada sistem inventaris.
 * Setiap properti pada entitas ini sesuai dengan kolom pada tabel 'barang' di basis data.
 */
@Entity('barang')
export class Barang {
  /**
   * Primary key, auto increment.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Kode unik untuk setiap barang.
   */
  @Column({ unique: true })
  kode_barang: string;

  /**
   * Nama barang.
   */
  @Column()
  nama_barang: string;

  /**
   * Deskripsi barang (opsional).
   */
  @Column({ nullable: true })
  deskripsi: string;

  /**
   * Satuan barang (misal: pcs, box, dll).
   */
  @Column()
  satuan: string;

  /**
   * Jumlah stok barang yang tersedia.
   * Default: 0
   */
  @Column({ default: 0 })
  stok: number;

  /**
   * Ambang batas kritis stok barang.
   * Default: 0
   */
  @Column({ default: 0 })
  ambang_batas_kritis: number;

  /**
   * Status aktif barang.
   * Default: true
   */
  @Column({ default: true })
  status_aktif: boolean;

  /**
   * Path atau URL foto barang (opsional).
   */
  @Column({ nullable: true })
  foto: string;

  /**
   * Tanggal dan waktu data barang dibuat (otomatis diisi oleh sistem).
   */
  @CreateDateColumn()
  created_at: Date;

  /**
   * Tanggal dan waktu data barang terakhir diperbarui (otomatis diisi oleh sistem).
   */
  @UpdateDateColumn()
  updated_at: Date;
}
