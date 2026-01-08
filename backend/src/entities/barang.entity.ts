/**
 * File: barang.entity.ts
 *
 * Entitas Barang digunakan untuk merepresentasikan data barang pada sistem SIAP (Sistem Informasi Administrasi dan Pengelolaan Barang).
 * Entitas ini berfungsi sebagai model utama untuk pengelolaan inventaris barang, termasuk proses permintaan, verifikasi, dan pelacakan stok.
 *
 * Setiap properti pada entitas ini sesuai dengan kolom pada tabel 'barang' di basis data.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Class Barang
 *
 * Class ini digunakan untuk mendefinisikan struktur data barang pada sistem SIAP.
 *
 * Parameter:
 * - Tidak ada parameter pada class ini, seluruh properti diatur melalui ORM dan migrasi basis data.
 *
 * Output:
 * - Instance dari Barang yang merepresentasikan satu data barang pada basis data.
 */
@Entity('barang')
export class Barang {
  /**
   * id (number): Primary key, auto increment.
   * Digunakan sebagai identitas unik setiap barang.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * kode_barang (string): Kode barang (tidak lagi unik).
   * Memungkinkan beberapa barang memiliki kode yang sama dengan nama yang berbeda.
   */
  @Column()
  kode_barang!: string;

  /**
   * nama_barang (string): Nama barang.
   * Digunakan untuk menampilkan nama barang pada sistem.
   */
  @Column()
  nama_barang!: string;

  /**
   * deskripsi (string | null): Deskripsi barang (opsional).
   * Menjelaskan detail atau spesifikasi barang.
   */
  @Column({ nullable: true })
  deskripsi?: string;

  /**
   * satuan (string): Satuan barang (misal: pcs, box, dll).
   * Menentukan satuan pengukuran barang.
   */
  @Column()
  satuan!: string;

  /**
   * stok (number): Jumlah stok barang yang tersedia.
   * Default: 0. Digunakan untuk pelacakan ketersediaan barang.
   */
  @Column({ default: 0 })
  stok!: number;

  /**
   * ambang_batas_kritis (number): Ambang batas kritis stok barang.
   * Default: 0. Jika stok <= ambang batas, sistem dapat memberikan notifikasi.
   */
  @Column({ default: 0 })
  ambang_batas_kritis!: number;

  /**
   * status_aktif (boolean): Status aktif barang.
   * Default: true. Menandakan apakah barang masih digunakan dalam sistem.
   */
  @Column({ default: true })
  status_aktif!: boolean;

  /**
   * foto (string | null): Path atau URL foto barang (opsional).
   * Digunakan untuk menampilkan gambar barang pada aplikasi.
   */
  @Column({ nullable: true })
  foto?: string;

  /**
   * kategori (string | null): Kategori barang (opsional).
   * Memudahkan pengelompokan barang dalam sistem.
   */
  @Column({ nullable: true })
  kategori?: string;

  /**
   * created_at (Date): Tanggal dan waktu data barang dibuat.
   * Diisi otomatis oleh sistem saat data barang ditambahkan.
   */
  @CreateDateColumn()
  created_at!: Date;

  /**
   * updated_at (Date): Tanggal dan waktu data barang terakhir diperbarui.
   * Diisi otomatis oleh sistem setiap kali data barang diubah.
   */
  @UpdateDateColumn()
  updated_at!: Date;
}
