import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permintaan } from '../entities/permintaan.entity';
import { DetailPermintaan } from '../entities/detail_permintaan.entity';
import { Barang } from '../entities/barang.entity';
import { Repository } from 'typeorm';
import { CreatePermintaanDto } from './dto/create-permintaan.dto';

@Injectable()
export class PermintaanService {
  constructor(
    @InjectRepository(Permintaan)
    private permintaanRepo: Repository<Permintaan>,
    @InjectRepository(DetailPermintaan)
    private detailRepo: Repository<DetailPermintaan>,
    @InjectRepository(Barang)
    private barangRepo: Repository<Barang>,
  ) {}

  async create(dto: CreatePermintaanDto, id_user_pemohon: number) {
    console.log('DTO:', dto);

    const barangIds = dto.items.map((i) => i.id_barang);
    const barangList = await this.barangRepo.findByIds(barangIds);

    if (barangList.length !== barangIds.length) {
      throw new BadRequestException(
        'Ada barang yang tidak ditemukan atau tidak aktif',
      );
    }

    // PERBAIKAN: Simpan ke kolom 'catatan' (bukan 'catatan_admin')
    const permintaan = this.permintaanRepo.create({
      id_user_pemohon,
      catatan: dto.catatan, // pastikan nama kolom di entity adalah 'catatan'
      status: 'Menunggu',
      tanggal_permintaan: new Date(),
    });
    const savedPermintaan = await this.permintaanRepo.save(permintaan);

    // Simpan detail_permintaan
    const details = dto.items.map((item) =>
      this.detailRepo.create({
        id_permintaan: savedPermintaan.id,
        id_barang: item.id_barang,
        jumlah_diminta: item.jumlah,
        jumlah_disetujui: 0,
      }),
    );
    await this.detailRepo.save(details);

    return {
      ...savedPermintaan,
      items: details,
    };
  }
}
