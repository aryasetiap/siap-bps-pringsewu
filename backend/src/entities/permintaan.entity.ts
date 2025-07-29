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
 * Entitas Permintaan
 *
 * Merepresentasikan permintaan data yang diajukan oleh pengguna.
 * Setiap permintaan memiliki pemohon, status, catatan, serta detail permintaan terkait.
 */
@Entity('permintaan')
export class Permintaan {
  /**
   * Primary key permintaan (auto increment).
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * ID pengguna yang mengajukan permintaan.
   */
  @Column()
  id_user_pemohon: number;

  /**
   * Relasi ke entitas User sebagai pemohon.
   */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_user_pemohon' })
  pemohon: User;

  /**
   * Tanggal permintaan diajukan.
   * Default: waktu saat data dibuat.
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  tanggal_permintaan: Date;

  /**
   * Status permintaan.
   * Nilai: 'Menunggu', 'Disetujui', 'Disetujui Sebagian', atau 'Ditolak'.
   * Default: 'Menunggu'.
   */
  @Column({ default: 'Menunggu' })
  status: 'Menunggu' | 'Disetujui' | 'Disetujui Sebagian' | 'Ditolak';

  /**
   * Catatan tambahan terkait permintaan (opsional).
   */
  @Column({ nullable: true })
  catatan: string;

  /**
   * ID user verifikator yang memproses permintaan (opsional).
   */
  @Column({ nullable: true })
  id_user_verifikator: number;

  /**
   * Tanggal permintaan diverifikasi (opsional).
   */
  @Column({ type: 'timestamp', nullable: true })
  tanggal_verifikasi: Date;

  /**
   * Tanggal data permintaan dibuat (otomatis oleh sistem).
   */
  @CreateDateColumn()
  created_at: Date;

  /**
   * Tanggal data permintaan terakhir diubah (otomatis oleh sistem).
   */
  @UpdateDateColumn()
  updated_at: Date;

  /**
   * Daftar detail permintaan yang terkait dengan permintaan ini.
   */
  @OneToMany(() => DetailPermintaan, (detail) => detail.permintaan)
  details: DetailPermintaan[];
}
