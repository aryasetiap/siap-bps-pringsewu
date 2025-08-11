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

      const allowed = ['setuju', 'sebagian', 'tolak'];
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

    const formatDate = (date: Date): string => {
      if (!date) return '-';

      // Daftar nama bulan dalam bahasa Indonesia
      const namaBulan = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ];

      const day = String(date.getDate()).padStart(2, '0');
      const month = date.getMonth(); // 0-11
      const year = date.getFullYear();

      return `${day} ${namaBulan[month]} ${year}`;
    };

    // Gunakan tanggal saat ini untuk dokumen
    const today = new Date();
    const currentDateString = formatDate(today);

    // Tetap simpan tanggal permintaan untuk referensi
    const permintaanDateString = formatDate(permintaan.tanggal_permintaan);

    // Konfigurasi font
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

    // Logo BPS
    const logoPath = path.join(
      __dirname,
      '../assets/images/logo-bps-pringsewu.png',
    );

    // Definisi dokumen PDF yang lebih modern
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],

      content: [
        // Header dengan logo dan judul
        {
          columns: [
            {
              width: 170,
              image: logoPath,
              fit: [170, 85],
            },
            {
              width: '*',
              text: '',
            },
          ],
        },

        // Judul dokumen
        {
          text: 'Permintaan',
          style: 'header',
          alignment: 'center',
          margin: [0, 10, 0, 0],
        },
        {
          text: 'Barang Persediaan',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 15],
        },

        // Unit kerja pemohon
        {
          text: permintaan.pemohon?.unit_kerja ?? '-',
          style: 'unitKerja',
          margin: [0, 0, 0, 20],
        },

        // Informasi nomor dan tanggal permintaan
        {
          columns: [
            {
              width: '50%',
              text: [
                { text: 'Nomor Permintaan: ', style: 'labelInfo' },
                { text: `#${permintaan.id}`, style: 'valueInfo' },
              ],
            },
            {
              width: '50%',
              text: [
                { text: 'Tanggal Permintaan: ', style: 'labelInfo' },
                { text: permintaanDateString, style: 'valueInfo' },
              ],
              alignment: 'right',
            },
          ],
          margin: [0, 0, 0, 10],
        },

        // Tabel data barang dengan styling modern
        {
          table: {
            headerRows: 1,
            widths: [30, '*', 60, 70, 80, 60],
            body: [
              [
                { text: 'No', style: 'tableHeader' },
                { text: 'Nama Barang', style: 'tableHeader' },
                { text: 'Jumlah', style: 'tableHeader' },
                { text: 'Kode Barang', style: 'tableHeader' },
                { text: 'Keterangan', style: 'tableHeader' },
                { text: 'Satuan', style: 'tableHeader' },
              ],
              ...permintaan.items.map((item, index) => [
                { text: index + 1, alignment: 'center' },
                item.barang?.nama_barang ?? '-',
                { text: item.jumlah_diminta, alignment: 'center' },
                { text: item.barang?.kode_barang ?? '-', alignment: 'center' },
                permintaan.catatan || '-',
                { text: item.barang?.satuan ?? '-', alignment: 'center' },
              ]),
            ],
          },
          layout: {
            hLineWidth: function (i, node) {
              return i === 0 || i === 1 || i === node.table.body.length
                ? 1
                : 0.5;
            },
            vLineWidth: function (i, node) {
              return 0.5;
            },
            hLineColor: function (i, node) {
              return i === 0 || i === 1 || i === node.table.body.length
                ? '#aaaaaa'
                : '#dddddd';
            },
            vLineColor: function (i, node) {
              return '#aaaaaa';
            },
            paddingLeft: function (i, node) {
              return 8;
            },
            paddingRight: function (i, node) {
              return 8;
            },
            paddingTop: function (i, node) {
              return 8;
            },
            paddingBottom: function (i, node) {
              return 8;
            },
          },
        },

        // Footer dengan tanggal dan tanda tangan
        {
          columns: [
            {
              width: '50%',
              stack: [
                {
                  text: `\n\nDi Bukukan: ${currentDateString}`,
                  margin: [0, 20, 0, 15],
                },
                { text: 'Kasubag Umum', margin: [0, 0, 0, 40] },
                { text: 'Singgih Adiwijaya, S.E, M.M', fontSize: 12 },
              ],
              alignment: 'left',
            },
            {
              width: '50%',
              stack: [
                {
                  text: `\n\nPringsewu, ${currentDateString}`,
                  margin: [0, 20, 0, 15],
                },
                { text: 'Penerima,', margin: [0, 0, 0, 40] },
                { text: permintaan.pemohon?.nama ?? '-', fontSize: 12 },
              ],
              alignment: 'left',
            },
          ],
        },
      ],

      // Definisi styles untuk tampilan modern
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          color: '#000000', // ubah ke warna hitam
        },
        unitKerja: {
          fontSize: 12,
          bold: true,
          color: '#000000', // ubah ke warna hitam
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          fillColor: '#f1f5f9',
          color: '#000000', // ubah ke warna hitam
          alignment: 'center',
          margin: [0, 4],
        },
        labelInfo: {
          fontSize: 10,
          color: '#000000', // ubah ke warna hitam
        },
        valueInfo: {
          fontSize: 10,
          bold: true,
          color: '#000000', // ubah ke warna hitam
        },
      },

      // Footer halaman (opsional)
      footer: {
        columns: [
          {
            text: 'SIAP BPS Pringsewu',
            alignment: 'center',
            fontSize: 8,
            color: '#000000', // ubah ke warna hitam
            margin: [0, 10, 0, 0],
          },
        ],
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

  async getAllPermintaan({
    status,
    page = 1,
    limit = 20,
  }: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const qb = this.permintaanRepo
      .createQueryBuilder('permintaan')
      .leftJoinAndSelect('permintaan.details', 'details')
      .leftJoinAndSelect('details.barang', 'barang')
      .leftJoinAndSelect('permintaan.pemohon', 'pemohon')
      .orderBy('permintaan.tanggal_permintaan', 'DESC');

    if (status) {
      qb.andWhere('permintaan.status = :status', { status });
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }
}
