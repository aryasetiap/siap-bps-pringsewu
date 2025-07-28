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

@Entity('permintaan')
export class Permintaan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_user_pemohon: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_user_pemohon' })
  pemohon: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  tanggal_permintaan: Date;

  @Column({ default: 'Menunggu' })
  status: 'Menunggu' | 'Disetujui' | 'Disetujui Sebagian' | 'Ditolak';

  @Column({ nullable: true })
  catatan: string;

  @Column({ nullable: true })
  id_user_verifikator: number;

  @Column({ type: 'timestamp', nullable: true })
  tanggal_verifikasi: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => DetailPermintaan, (detail) => detail.permintaan)
  details: DetailPermintaan[];
}
