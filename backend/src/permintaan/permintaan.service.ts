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
import { VerifikasiPermintaanDto } from './dto/verifikasi-permintaan.dto';

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

  async verifikasiPermintaan(
    id: number,
    dto: VerifikasiPermintaanDto,
    id_user_verifikator: number,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const permintaan = await manager.findOne(Permintaan, {
        where: { id },
        relations: ['details', 'details.barang'],
      });
      if (!permintaan)
        throw new NotFoundException('Permintaan tidak ditemukan');
      if (permintaan.status !== 'Menunggu')
        throw new BadRequestException('Permintaan sudah diverifikasi');

      // Validasi dan update detail_permintaan
      let totalDisetujui = 0;
      for (const item of dto.items) {
        const detail = permintaan.details.find((d) => d.id === item.id_detail);
        if (!detail)
          throw new BadRequestException(`Detail permintaan tidak ditemukan`);
        if (item.jumlah_disetujui > detail.barang.stok) {
          throw new BadRequestException(
            `Stok barang "${detail.barang.nama_barang}" tidak mencukupi. Stok tersedia: ${detail.barang.stok}, diminta: ${item.jumlah_disetujui}`,
          );
        }
        if (item.jumlah_disetujui > detail.jumlah_diminta) {
          throw new BadRequestException(
            `Jumlah disetujui tidak boleh melebihi jumlah diminta`,
          );
        }
        detail.jumlah_disetujui = item.jumlah_disetujui;
        totalDisetujui += item.jumlah_disetujui;
      }

      // Update stok barang jika disetujui
      if (dto.keputusan !== 'tolak') {
        for (const item of dto.items) {
          const detail = permintaan.details.find(
            (d) => d.id === item.id_detail,
          );
          if (!detail)
            throw new BadRequestException(`Detail permintaan tidak ditemukan`);
          if (item.jumlah_disetujui > 0) {
            detail.barang.stok -= item.jumlah_disetujui;
            if (detail.barang.stok < 0) {
              throw new BadRequestException(
                `Stok barang "${detail.barang.nama_barang}" tidak boleh minus`,
              );
            }
            await manager.save(detail.barang);
          }
        }
      }

      // Update status permintaan
      let status: 'Menunggu' | 'Disetujui' | 'Disetujui Sebagian' | 'Ditolak' =
        'Ditolak';
      if (dto.keputusan === 'setuju') status = 'Disetujui';
      else if (dto.keputusan === 'sebagian') status = 'Disetujui Sebagian';

      permintaan.status = status;
      permintaan.id_user_verifikator = id_user_verifikator;
      permintaan.tanggal_verifikasi = new Date();
      permintaan.catatan = dto.catatan_verifikasi ?? '';

      await manager.save(permintaan.details);
      await manager.save(permintaan);

      return {
        ...permintaan,
        items: permintaan.details,
      };
    });
  }
}
