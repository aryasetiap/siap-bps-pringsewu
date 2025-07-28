import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permintaan } from '../entities/permintaan.entity';
import { DetailPermintaan } from '../entities/detail_permintaan.entity';
import { Barang } from '../entities/barang.entity';
import { Repository, DataSource } from 'typeorm';
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
    private dataSource: DataSource, // inject DataSource
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

    // === Tambahan: Validasi stok tersedia ===
    for (const item of dto.items) {
      const barang = barangList.find((b) => b.id === item.id_barang);
      if (!barang) {
        throw new BadRequestException(
          `Barang dengan ID ${item.id_barang} tidak ditemukan`,
        );
      }
      if (barang.stok < item.jumlah) {
        throw new BadRequestException(
          `Stok barang "${barang.nama_barang}" tidak mencukupi. Stok tersedia: ${barang.stok}, diminta: ${item.jumlah}`,
        );
      }
    }
    // === End validasi stok ===

    return await this.dataSource.transaction(async (manager) => {
      // Simpan permintaan
      const permintaan = this.permintaanRepo.create({
        id_user_pemohon,
        catatan: dto.catatan,
        status: 'Menunggu',
        tanggal_permintaan: new Date(),
      });
      const savedPermintaan = await manager.save(permintaan);

      // Simpan detail_permintaan
      const details = dto.items.map((item) =>
        this.detailRepo.create({
          id_permintaan: savedPermintaan.id,
          id_barang: item.id_barang,
          jumlah_diminta: item.jumlah,
          jumlah_disetujui: 0,
        }),
      );
      const savedDetails = await manager.save(details);

      return {
        ...savedPermintaan,
        items: savedDetails,
      };
    });
  }

  async getRiwayatByUser(userId: number) {
    const riwayat = await this.permintaanRepo.find({
      where: { id_user_pemohon: userId },
      order: { tanggal_permintaan: 'DESC' },
      relations: ['details', 'details.barang'],
    });
    // Tambahkan field items agar konsisten dengan response detail
    return riwayat.map((permintaan) => ({
      ...permintaan,
      items: permintaan.details,
    }));
  }

  async findOneById(id: number) {
    const permintaan = await this.permintaanRepo.findOne({
      where: { id },
      relations: ['details', 'details.barang', 'pemohon'],
    });
    if (!permintaan) throw new NotFoundException('Permintaan tidak ditemukan');
    // Map details ke items agar response konsisten
    return {
      ...permintaan,
      items: permintaan.details,
    };
  }

  async getPermintaanMenunggu() {
    return this.permintaanRepo.find({
      where: { status: 'Menunggu' },
      order: { tanggal_permintaan: 'ASC' },
      relations: ['details', 'details.barang', 'pemohon'],
    });
  }
}
