import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('barang')
export class Barang {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  kode_barang: string;

  @Column()
  nama_barang: string;

  @Column({ nullable: true })
  deskripsi: string;

  @Column()
  satuan: string;

  @Column({ default: 0 })
  stok: number;

  @Column({ default: 0 })
  ambang_batas_kritis: number;

  @Column({ default: true })
  status_aktif: boolean;

  @Column({ nullable: true })
  foto: string; // URL/path file foto barang

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
