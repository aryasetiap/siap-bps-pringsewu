import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permintaan } from '../entities/permintaan.entity';
import { DetailPermintaan } from '../entities/detail_permintaan.entity';
import { Barang } from '../entities/barang.entity';
import { User } from '../entities/user.entity'; // Tambahkan import User
import { Repository, DataSource } from 'typeorm';
import { CreatePermintaanDto } from './dto/create-permintaan.dto';
import { VerifikasiPermintaanDto } from './dto/verifikasi-permintaan.dto';
import * as PdfPrinter from 'pdfmake';
import * as path from 'path';

@Injectable()
export class PermintaanService {
  constructor(
    @InjectRepository(Permintaan)
    private permintaanRepo: Repository<Permintaan>,
    @InjectRepository(DetailPermintaan)
    private detailRepo: Repository<DetailPermintaan>,
    @InjectRepository(Barang)
    private barangRepo: Repository<Barang>,
    @InjectRepository(User) // Tambahkan ini
    private userRepo: Repository<User>, // Tambahkan ini
    private dataSource: DataSource,
  ) {}

  /**
   * Membuat permintaan barang baru.
   * @param dto Data permintaan yang berisi daftar barang dan catatan.
   * @param userId ID user pemohon.
   * @returns Data permintaan yang telah dibuat beserta detail barang.
   * @throws BadRequestException jika data tidak valid atau stok tidak mencukupi.
   */
  async create(dto: CreatePermintaanDto, userId: number) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Items tidak boleh kosong');
    }
    const barangIds = dto.items.map((i) => i.id_barang);
    const barangList = (await this.barangRepo.findByIds(barangIds)) ?? [];
    if (barangList.length !== barangIds.length) {
      throw new BadRequestException(
        'Ada barang yang tidak ditemukan atau tidak aktif',
      );
    }

    for (const item of dto.items) {
      const barang = barangList.find((b) => b.id === item.id_barang);
      if (!barang) {
        throw new BadRequestException(
          `Barang dengan ID ${item.id_barang} tidak ditemukan`,
        );
      }
      if (barang.status_aktif === false) {
        throw new BadRequestException(
          `Barang dengan ID ${item.id_barang} tidak aktif`,
        );
      }
      if (barang.stok < item.jumlah) {
        throw new BadRequestException(
          `Stok barang "${barang.nama_barang}" tidak mencukupi. Stok tersedia: ${barang.stok}, diminta: ${item.jumlah}`,
        );
      }
    }

    return await this.dataSource.transaction(async (manager) => {
      const permintaan = this.permintaanRepo.create({
        id_user_pemohon: userId,
        catatan: dto.catatan,
        status: 'Menunggu',
        tanggal_permintaan: new Date(),
      });
      const savedPermintaan = await manager.save(permintaan);

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

  /**
   * Mengambil riwayat permintaan berdasarkan user.
   * @param userId ID user pemohon.
   * @returns Daftar permintaan beserta detail barang yang pernah diajukan user.
   */
  async getRiwayatByUser(userId: number) {
    const riwayat = await this.permintaanRepo.find({
      where: { id_user_pemohon: userId },
      order: { tanggal_permintaan: 'DESC' },
      relations: ['details', 'details.barang'],
    });
    return riwayat.map((permintaan) => ({
      ...permintaan,
      items: permintaan.details,
    }));
  }

  /**
   * Mengambil detail permintaan berdasarkan ID.
   * @param id ID permintaan.
   * @returns Data permintaan beserta detail barang.
   * @throws NotFoundException jika permintaan tidak ditemukan.
   */
  async findOneById(id: number) {
    const permintaan = await this.permintaanRepo.findOne({
      where: { id },
      relations: ['details', 'details.barang', 'pemohon'],
    });
    if (!permintaan) throw new NotFoundException('Permintaan tidak ditemukan');
    return {
      ...permintaan,
      items: permintaan.details,
    };
  }

  /**
   * Mengambil daftar permintaan yang masih menunggu verifikasi.
   * @returns Daftar permintaan dengan status 'Menunggu'.
   */
  async getPermintaanMenunggu() {
    return this.permintaanRepo.find({
      where: { status: 'Menunggu' },
      order: { tanggal_permintaan: 'ASC' },
      relations: ['details', 'details.barang', 'pemohon'],
    });
  }

  /**
   * Memverifikasi permintaan barang.
   * @param id ID permintaan yang akan diverifikasi.
   * @param dto Data verifikasi (keputusan dan detail barang).
   * @param verifikatorId ID user verifikator.
   * @returns Data permintaan yang telah diverifikasi.
   * @throws BadRequestException atau NotFoundException jika data tidak valid.
   */
  async verifikasiPermintaan(
    id: number,
    dto: VerifikasiPermintaanDto,
    verifikatorId: number,
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

      const allowed = ['setuju', 'setuju_sebagian', 'tolak'];
      if (!allowed.includes(dto.keputusan)) {
        throw new BadRequestException('Keputusan tidak valid');
      }

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

      let status: 'Menunggu' | 'Disetujui' | 'Disetujui Sebagian' | 'Ditolak' =
        'Ditolak';
      if (dto.keputusan === 'setuju') status = 'Disetujui';
      else if (dto.keputusan === 'sebagian') status = 'Disetujui Sebagian';

      permintaan.status = status;
      permintaan.id_user_verifikator = verifikatorId;
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

  /**
   * Mengambil statistik dashboard terkait barang dan permintaan.
   * @returns Statistik total barang, permintaan tertunda, dan barang kritis.
   */
  async getDashboardStatistik() {
    const [totalBarang, totalPermintaanTertunda, totalBarangKritis, totalUser] =
      await Promise.all([
        this.barangRepo.count(),
        this.permintaanRepo.count({ where: { status: 'Menunggu' } }),
        this.barangRepo
          .createQueryBuilder('barang')
          .where('barang.stok <= barang.ambang_batas_kritis')
          .andWhere('barang.status_aktif = :aktif', { aktif: true })
          .getCount(),
        this.userRepo.count({ where: { status_aktif: true } }),
      ]);
    return {
      totalBarang,
      totalPermintaanTertunda,
      totalBarangKritis,
      totalUser,
    };
  }

  /**
   * Mengambil tren permintaan bulanan selama 12 bulan terakhir.
   * @returns Array data jumlah permintaan per bulan.
   */
  async getTrenPermintaanBulanan() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const data = await this.permintaanRepo
      .createQueryBuilder('permintaan')
      .select([
        "TO_CHAR(permintaan.tanggal_permintaan, 'YYYY-MM') AS bulan",
        'COUNT(*)::int AS jumlah',
      ])
      .where('permintaan.tanggal_permintaan >= :start', { start })
      .groupBy('bulan')
      .orderBy('bulan', 'ASC')
      .getRawMany();

    const result: { bulan: string; jumlah: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      const bulan = d.toISOString().slice(0, 7);
      const found = data.find((row) => row.bulan === bulan);
      result.push({ bulan, jumlah: found ? Number(found.jumlah) : 0 });
    }
    return result;
  }

  /**
   * Menghasilkan file PDF bukti permintaan barang.
   * @param id ID permintaan yang akan dibuatkan PDF.
   * @returns Buffer file PDF.
   * @throws NotFoundException jika permintaan tidak ditemukan.
   */
  async generateBuktiPermintaanPDF(id: number): Promise<Buffer> {
    const permintaan = await this.findOneById(id);
    if (!permintaan) throw new NotFoundException('Permintaan tidak ditemukan');

    const fonts = {
      Roboto: {
        normal: path.join(__dirname, '../assets/fonts/Roboto-Regular.ttf'),
        bold: path.join(__dirname, '../assets/fonts/Roboto-Bold.ttf'),
        italics: path.join(__dirname, '../assets/fonts/Roboto-Italic.ttf'),
        bolditalics: path.join(
          __dirname,
          '../assets/fonts/Roboto-BoldItalic.ttf',
        ),
      },
    };
    const printer = new PdfPrinter(fonts);

    const docDefinition = {
      content: [
        { text: 'Bukti Permintaan Barang', style: 'header' },
        { text: `Nomor: ${permintaan.id}`, margin: [0, 10, 0, 0] },
        {
          text: `Tanggal: ${new Date(permintaan.tanggal_permintaan).toLocaleDateString('id-ID')}`,
        },
        { text: `Pemohon: ${permintaan.pemohon?.nama ?? '-'}` },
        { text: `Unit Kerja: ${permintaan.pemohon?.unit_kerja ?? '-'}` },
        { text: `Status: ${permintaan.status}` },
        {
          text: `Catatan: ${permintaan.catatan ?? '-'}`,
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 50, 50, 50],
            body: [
              [
                { text: 'Nama Barang', style: 'tableHeader' },
                { text: 'Diminta', style: 'tableHeader' },
                { text: 'Disetujui', style: 'tableHeader' },
                { text: 'Satuan', style: 'tableHeader' },
              ],
              ...permintaan.items.map((item) => [
                item.barang?.nama_barang ?? '-',
                item.jumlah_diminta,
                item.jumlah_disetujui,
                item.barang?.satuan ?? '-',
              ]),
            ],
          },
          layout: 'lightHorizontalLines',
        },
      ],
      styles: {
        header: { fontSize: 16, bold: true, alignment: 'center' },
        tableHeader: { bold: true, fillColor: '#eeeeee' },
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks: Buffer[] = [];
    return new Promise<Buffer>((resolve, reject) => {
      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);
      pdfDoc.end();
    });
  }
}
