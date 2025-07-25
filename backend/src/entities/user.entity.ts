import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'pegawai' })
  role: 'admin' | 'pegawai';

  @Column({ nullable: true })
  unit_kerja: string;

  @Column({ default: true })
  status_aktif: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  foto: string; // URL/path foto profil user
}
