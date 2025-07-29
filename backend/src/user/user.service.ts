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

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username, status_aktif: true } });
  }

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

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    // Terapkan perubahan field selain password dulu
    Object.assign(user, dto);

    // Jika ada password baru, hash dan timpa field password
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
    // Jangan return password ke client
    const { password, ...result } = saved;
    return result as User;
  }

  async softDelete(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.status_aktif = false;
    return this.userRepo.save(user);
  }
}
