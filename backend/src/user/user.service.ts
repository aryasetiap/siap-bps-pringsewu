import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  /**
   * Mencari user berdasarkan username yang masih aktif.
   * @param username - Username yang ingin dicari.
   * @returns User jika ditemukan, atau null jika tidak ada.
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username, status_aktif: true } });
  }

  /**
   * Membuat user baru dengan data yang diberikan.
   * @param dto - Data user baru (CreateUserDto).
   * @returns User yang berhasil dibuat.
   * @throws BadRequestException jika username sudah terdaftar.
   */
  async create(dto: CreateUserDto): Promise<User> {
    const exist = await this.userRepo.findOne({
      where: { username: dto.username },
    });
    if (exist) throw new BadRequestException('Username sudah terdaftar');
    const user = this.userRepo.create({
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
      status_aktif: true,
    });
    return this.userRepo.save(user);
  }

  /**
   * Mengambil seluruh data user.
   * @returns Array berisi seluruh user.
   */
  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  /**
   * Mengambil data user berdasarkan ID.
   * @param id - ID user yang ingin dicari.
   * @returns User yang ditemukan.
   * @throws NotFoundException jika user tidak ditemukan.
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    return user;
  }

  /**
   * Memperbarui data user berdasarkan ID dan data baru.
   * @param id - ID user yang ingin diperbarui.
   * @param dto - Data baru untuk user (UpdateUserDto).
   * @returns User yang sudah diperbarui (tanpa field password).
   * @throws NotFoundException jika user tidak ditemukan.
   */
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    Object.assign(user, dto);

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.status_aktif !== undefined) {
      if (typeof dto.status_aktif === 'string') {
        user.status_aktif = dto.status_aktif === 'aktif';
      } else {
        user.status_aktif = !!dto.status_aktif;
      }
    }

    const saved = await this.userRepo.save(user);
    const { password, ...result } = saved;
    return result as User;
  }

  /**
   * Melakukan soft delete pada user (mengubah status_aktif menjadi false).
   * @param id - ID user yang ingin di-nonaktifkan.
   * @returns User yang sudah di-nonaktifkan.
   * @throws NotFoundException jika user tidak ditemukan.
   */
  async softDelete(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.status_aktif = false;
    return this.userRepo.save(user);
  }
}
