import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Barang } from '../entities/barang.entity';
import { Repository } from 'typeorm';
import { CreateBarangDto } from './dto/create-barang.dto';
import { UpdateBarangDto } from './dto/update-barang.dto';

@Injectable()
export class BarangService {
  constructor(
    @InjectRepository(Barang)
    private barangRepo: Repository<Barang>,
  ) {}

  async create(dto: CreateBarangDto): Promise<Barang> {
    const exist = await this.barangRepo.findOne({
      where: { kode_barang: dto.kode_barang },
    });
    if (exist) throw new BadRequestException('Kode barang sudah terdaftar');
    const barang = this.barangRepo.create({ ...dto, status_aktif: true });
    return this.barangRepo.save(barang);
  }

  async findAll(): Promise<Barang[]> {
    return this.barangRepo.find();
  }

  async findOne(id: number): Promise<Barang> {
    const barang = await this.barangRepo.findOne({ where: { id } });
    if (!barang) throw new NotFoundException('Barang tidak ditemukan');
    return barang;
  }

  async update(id: number, dto: UpdateBarangDto): Promise<Barang> {
    const barang = await this.findOne(id);
    Object.assign(barang, dto);
    return this.barangRepo.save(barang);
  }

  async softDelete(id: number): Promise<Barang> {
    const barang = await this.findOne(id);
    barang.status_aktif = false;
    return this.barangRepo.save(barang);
  }

  async remove(id: number): Promise<void> {
    const barang = await this.findOne(id);
    await this.barangRepo.remove(barang);
  }
}
