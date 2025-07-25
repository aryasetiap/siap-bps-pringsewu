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

@Entity('detail_permintaan')
export class DetailPermintaan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_permintaan: number;

  @ManyToOne(() => Permintaan)
  @JoinColumn({ name: 'id_permintaan' })
  permintaan: Permintaan;

  @Column()
  id_barang: number;

  @ManyToOne(() => Barang)
  @JoinColumn({ name: 'id_barang' })
  barang: Barang;

  @Column()
  jumlah_diminta: number;

  @Column({ default: 0 })
  jumlah_disetujui: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
