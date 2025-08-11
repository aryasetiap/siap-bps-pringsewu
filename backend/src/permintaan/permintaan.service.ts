/**
 * File: permintaan.service.ts
 * Service utama untuk pengelolaan permintaan barang persediaan di aplikasi SIAP BPS Pringsewu.
 * Meliputi pembuatan permintaan, verifikasi, pengambilan riwayat, statistik dashboard, dan pembuatan bukti PDF.
 */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permintaan } from '../entities/permintaan.entity';
import { DetailPermintaan } from '../entities/detail_permintaan.entity';
import { Barang } from '../entities/barang.entity';
import { User } from '../entities/user.entity';
import { Repository, DataSource } from 'typeorm';
import { CreatePermintaanDto } from './dto/create-permintaan.dto';
import { VerifikasiPermintaanDto } from './dto/verifikasi-permintaan.dto';
import * as PdfPrinter from 'pdfmake';
import * as path from 'path';

/**
 * Service untuk pengelolaan permintaan barang persediaan.
 * Menyediakan fungsi CRUD, verifikasi, statistik, dan pembuatan PDF bukti permintaan.
 */
@Injectable()
export class PermintaanService {
  /**
   * Konstruktor untuk dependency injection repository dan dataSource.
   */
  constructor(
    @InjectRepository(Permintaan)
    private permintaanRepo: Repository<Permintaan>,
    @InjectRepository(DetailPermintaan)
    private detailRepo: Repository<DetailPermintaan>,
    @InjectRepository(Barang)
    private barangRepo: Repository<Barang>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private dataSource: DataSource,
  ) {}

  /**
   * Membuat permintaan barang baru oleh user pemohon.
   *
   * Parameter:
   * - dto (CreatePermintaanDto): Data permintaan berisi daftar barang dan catatan.
   * - userId (number): ID user pemohon.
   *
   * Return:
   * - Promise<object>: Data permintaan beserta detail barang yang telah dibuat.
   *
   * Throws:
   * - BadRequestException jika data tidak valid atau stok tidak mencukupi.
   */
  async create(dto: CreatePermintaanDto, userId: number) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Items tidak boleh kosong');
    }

    const barangIds = dto.items.map((item) => item.id_barang);
    const barangList = await this.barangRepo.findByIds(barangIds);

    if (barangList.length !== barangIds.length) {
      throw new BadRequestException(
        'Ada barang yang tidak ditemukan atau tidak aktif',
      );
    }

    // Validasi stok dan status barang
    for (const item of dto.items) {
      const barang = barangList.find((b) => b.id === item.id_barang);
      if (!barang) {
        throw new BadRequestException(
          `Barang dengan ID ${item.id_barang} tidak ditemukan`,
        );
      }
      if (!barang.status_aktif) {
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

    // Transaksi pembuatan permintaan dan detail barang
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
   * Mengambil riwayat permintaan barang berdasarkan user pemohon.
   *
   * Parameter:
   * - userId (number): ID user pemohon.
   *
   * Return:
   * - Promise<object[]>: Daftar permintaan beserta detail barang yang pernah diajukan user.
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
   * Mengambil detail permintaan berdasarkan ID permintaan.
   *
   * Parameter:
   * - id (number): ID permintaan.
   *
   * Return:
   * - Promise<object>: Data permintaan beserta detail barang.
   *
   * Throws:
   * - NotFoundException jika permintaan tidak ditemukan.
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
   *
   * Return:
   * - Promise<Permintaan[]>: Daftar permintaan dengan status 'Menunggu'.
   */
  async getPermintaanMenunggu() {
    return this.permintaanRepo.find({
      where: { status: 'Menunggu' },
      order: { tanggal_permintaan: 'ASC' },
      relations: ['details', 'details.barang', 'pemohon'],
    });
  }

  /**
   * Memverifikasi permintaan barang oleh verifikator.
   *
   * Parameter:
   * - id (number): ID permintaan yang akan diverifikasi.
   * - dto (VerifikasiPermintaanDto): Data verifikasi (keputusan dan detail barang).
   * - verifikatorId (number): ID user verifikator.
   *
   * Return:
   * - Promise<object>: Data permintaan yang telah diverifikasi.
   *
   * Throws:
   * - BadRequestException atau NotFoundException jika data tidak valid.
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

      const allowedKeputusan = ['setuju', 'sebagian', 'tolak'];
      if (!allowedKeputusan.includes(dto.keputusan)) {
        throw new BadRequestException('Keputusan tidak valid');
      }

      // Validasi jumlah disetujui dan stok barang
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
      }

      // Pengurangan stok barang jika permintaan disetujui/sebagian
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

      // Penentuan status permintaan berdasarkan keputusan
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
   *
   * Return:
   * - Promise<object>: Statistik total barang, permintaan tertunda, barang kritis, dan user aktif.
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
   *
   * Return:
   * - Promise<{ bulan: string; jumlah: number }[]>: Array data jumlah permintaan per bulan.
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

    // Membentuk array 12 bulan terakhir, isi 0 jika tidak ada data
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
   *
   * Parameter:
   * - id (number): ID permintaan yang akan dibuatkan PDF.
   *
   * Return:
   * - Promise<Buffer>: Buffer file PDF.
   *
   * Throws:
   * - NotFoundException jika permintaan tidak ditemukan.
   */
  async generateBuktiPermintaanPDF(id: number): Promise<Buffer> {
    const permintaan = await this.findOneById(id);

    /**
     * Fungsi untuk memformat tanggal ke format Indonesia.
     */
    const formatDate = (date: Date): string => {
      if (!date) return '-';
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
      const month = date.getMonth();
      const year = date.getFullYear();
      return `${day} ${namaBulan[month]} ${year}`;
    };

    const today = new Date();
    const currentDateString = formatDate(today);
    const permintaanDateString = formatDate(permintaan.tanggal_permintaan);

    // Konfigurasi font dan logo
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
    const logoPath = path.join(
      __dirname,
      '../assets/images/logo-bps-pringsewu.png',
    );

    /**
     * Definisi dokumen PDF bukti permintaan barang.
     * Terdiri dari header, tabel barang, dan footer tanda tangan.
     */
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      content: [
        {
          columns: [
            { width: 170, image: logoPath, fit: [170, 85] },
            { width: '*', text: '' },
          ],
        },
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
        {
          text: permintaan.pemohon?.unit_kerja ?? '-',
          style: 'unitKerja',
          margin: [0, 0, 0, 20],
        },
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
            hLineWidth: (i, node) =>
              i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.5,
            vLineWidth: () => 0.5,
            hLineColor: (i, node) =>
              i === 0 || i === 1 || i === node.table.body.length
                ? '#aaaaaa'
                : '#dddddd',
            vLineColor: () => '#aaaaaa',
            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 8,
            paddingBottom: () => 8,
          },
        },
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
      styles: {
        header: { fontSize: 16, bold: true, color: '#000000' },
        unitKerja: { fontSize: 12, bold: true, color: '#000000' },
        tableHeader: {
          bold: true,
          fontSize: 10,
          fillColor: '#f1f5f9',
          color: '#000000',
          alignment: 'center',
          margin: [0, 4],
        },
        labelInfo: { fontSize: 10, color: '#000000' },
        valueInfo: { fontSize: 10, bold: true, color: '#000000' },
      },
      footer: {
        columns: [
          {
            text: 'SIAP BPS Pringsewu',
            alignment: 'center',
            fontSize: 8,
            color: '#000000',
            margin: [0, 10, 0, 0],
          },
        ],
      },
    };

    // Proses pembuatan PDF dan pengembalian buffer
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks: Buffer[] = [];
    return new Promise<Buffer>((resolve, reject) => {
      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);
      pdfDoc.end();
    });
  }

  /**
   * Mengambil seluruh permintaan barang dengan filter status dan paginasi.
   *
   * Parameter:
   * - status (string, optional): Filter status permintaan.
   * - page (number, optional): Nomor halaman.
   * - limit (number, optional): Jumlah data per halaman.
   *
   * Return:
   * - Promise<{ data: Permintaan[]; total: number; page: number; limit: number }>: Data permintaan dan info paginasi.
   */
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
