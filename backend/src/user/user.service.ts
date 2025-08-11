/**
 * File: user.service.ts
 * Service untuk pengelolaan data user pada aplikasi SIAP.
 * Berisi fungsi-fungsi untuk pembuatan, pencarian, pembaruan, dan penghapusan user.
 * Digunakan dalam proses verifikasi, permintaan, dan pengelolaan barang oleh user.
 */

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

/**
 * Service untuk pengelolaan user pada aplikasi SIAP.
 * Meliputi pembuatan, pencarian, pembaruan, dan penghapusan user.
 */
@Injectable()
export class UserService {
  /**
   * Konstruktor UserService.
   *
   * Parameter:
   * - userRepo (Repository<User>): Repository TypeORM untuk entitas User.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Mencari user aktif berdasarkan username.
   *
   * Parameter:
   * - username (string): Username yang ingin dicari.
   *
   * Return:
   * - Promise<User | null>: User aktif jika ditemukan, null jika tidak ada.
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { username, status_aktif: true },
    });
  }

  /**
   * Membuat user baru dengan data yang diberikan.
   * Password akan di-hash sebelum disimpan.
   *
   * Parameter:
   * - dto (CreateUserDto): Data user baru.
   *
   * Return:
   * - Promise<User>: User yang berhasil dibuat.
   *
   * Throws:
   * - BadRequestException: Jika username sudah terdaftar.
   */
  async create(dto: CreateUserDto): Promise<User> {
    const userSudahAda = await this.userRepo.findOne({
      where: { username: dto.username },
    });
    if (userSudahAda) {
      throw new BadRequestException('Username sudah terdaftar');
    }

    const userBaru = this.userRepo.create({
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
      status_aktif: true,
    });

    return this.userRepo.save(userBaru);
  }

  /**
   * Mengambil seluruh data user.
   *
   * Return:
   * - Promise<User[]>: Array berisi seluruh user.
   */
  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  /**
   * Mengambil data user berdasarkan ID.
   *
   * Parameter:
   * - id (number): ID user yang ingin dicari.
   *
   * Return:
   * - Promise<User>: User yang ditemukan.
   *
   * Throws:
   * - NotFoundException: Jika user tidak ditemukan.
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }
    return user;
  }

  /**
   * Memperbarui data user berdasarkan ID dan data baru.
   * Jika password diberikan, akan di-hash sebelum disimpan.
   * Field status_aktif dapat berupa string atau boolean.
   *
   * Parameter:
   * - id (number): ID user yang ingin diperbarui.
   * - dto (UpdateUserDto): Data baru untuk user.
   *
   * Return:
   * - Promise<User>: User yang sudah diperbarui (tanpa field password).
   *
   * Throws:
   * - NotFoundException: Jika user tidak ditemukan.
   */
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    // Update field selain password dan status_aktif
    Object.assign(user, {
      ...dto,
      password: undefined,
      status_aktif: undefined,
    });

    // Jika password diberikan, hash terlebih dahulu
    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    // Penyesuaian status_aktif agar konsisten boolean
    if (dto.status_aktif !== undefined) {
      user.status_aktif =
        typeof dto.status_aktif === 'string'
          ? dto.status_aktif === 'aktif'
          : !!dto.status_aktif;
    }

    const userTersimpan = await this.userRepo.save(user);

    // Menghilangkan field password dari hasil return
    const { password, ...userTanpaPassword } = userTersimpan;
    return userTanpaPassword as User;
  }

  /**
   * Melakukan soft delete pada user (mengubah status_aktif menjadi false).
   * User tetap ada di database, namun tidak aktif untuk proses bisnis SIAP.
   *
   * Parameter:
   * - id (number): ID user yang ingin di-nonaktifkan.
   *
   * Return:
   * - Promise<User>: User yang sudah di-nonaktifkan.
   *
   * Throws:
   * - NotFoundException: Jika user tidak ditemukan.
   */
  async softDelete(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.status_aktif = false;
    return this.userRepo.save(user);
  }
}
