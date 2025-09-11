/**
 * File: barang.service.ts
 * Service untuk pengelolaan data barang persediaan pada aplikasi SIAP BPS Pringsewu.
 * Meliputi pembuatan, pembaruan, penghapusan, penambahan stok, serta pembuatan laporan penggunaan barang.
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Barang } from '../entities/barang.entity';
import { Repository, DataSource } from 'typeorm';
import { CreateBarangDto } from './dto/create-barang.dto';
import { UpdateBarangDto } from './dto/update-barang.dto';
import { AddStokDto } from './dto/add-stok.dto';
import * as PdfPrinter from 'pdfmake';
import * as path from 'path';

/**
 * Kelas service untuk pengelolaan barang persediaan.
 * Menyediakan fungsi CRUD, penambahan stok, dan pembuatan laporan penggunaan barang.
 */
@Injectable()
export class BarangService {
  /**
   * Konstruktor BarangService.
   *
   * Parameter:
   * - barangRepo (Repository<Barang>): Repository untuk entitas Barang.
   * - dataSource (DataSource): DataSource TypeORM untuk query custom.
   */
  constructor(
    @InjectRepository(Barang)
    private barangRepo: Repository<Barang>,
    private dataSource: DataSource,
  ) {}

  /**
   * Membuat data barang baru.
   *
   * Parameter:
   * - dto (CreateBarangDto): Data barang yang akan dibuat.
   *
   * Return:
   * - Promise<Barang>: Barang yang berhasil dibuat.
   *
   * Exception:
   * - BadRequestException: Jika kode barang sudah terdaftar.
   */
  async create(dto: CreateBarangDto): Promise<Barang> {
    const barangSudahAda = await this.barangRepo.findOne({
      where: { kode_barang: dto.kode_barang },
    });
    if (barangSudahAda) {
      throw new BadRequestException('Kode barang sudah terdaftar');
    }
    const barangBaru = this.barangRepo.create({ ...dto, status_aktif: true });
    return this.barangRepo.save(barangBaru);
  }

  /**
   * Mengambil daftar barang berdasarkan filter pencarian, status aktif, dan stok kritis.
   *
   * Parameter:
   * - query (object): Opsi pencarian (q, status_aktif, stok_kritis).
   *
   * Return:
   * - Promise<Barang[]>: Daftar barang sesuai filter.
   */
  async findAll(query?: {
    q?: string;
    status_aktif?: boolean;
    stok_kritis?: boolean;
  }): Promise<Barang[]> {
    const qb = this.barangRepo.createQueryBuilder('barang');

    if (query?.q) {
      qb.andWhere(
        '(barang.nama_barang ILIKE :q OR barang.kode_barang ILIKE :q)',
        { q: `%${query.q}%` },
      );
    }

    if (typeof query?.status_aktif === 'boolean') {
      qb.andWhere('barang.status_aktif = :status', {
        status: query.status_aktif,
      });
    }

    if (query?.stok_kritis) {
      qb.andWhere('barang.stok <= barang.ambang_batas_kritis');
    }

    return qb.getMany();
  }

  /**
   * Mengambil detail barang berdasarkan ID.
   *
   * Parameter:
   * - id (number): ID barang.
   *
   * Return:
   * - Promise<Barang>: Barang yang ditemukan.
   *
   * Exception:
   * - NotFoundException: Jika barang tidak ditemukan.
   */
  async findOne(id: number): Promise<Barang> {
    const barang = await this.barangRepo.findOne({ where: { id } });
    if (!barang) {
      throw new NotFoundException('Barang tidak ditemukan');
    }
    return barang;
  }

  /**
   * Memperbarui data barang berdasarkan ID.
   *
   * Parameter:
   * - id (number): ID barang.
   * - dto (UpdateBarangDto): Data yang akan diperbarui.
   *
   * Return:
   * - Promise<Barang>: Barang yang telah diperbarui.
   *
   * Exception:
   * - BadRequestException: Jika stok negatif.
   */
  async update(id: number, dto: UpdateBarangDto): Promise<Barang> {
    if (dto.stok !== undefined && dto.stok < 0) {
      throw new BadRequestException('Stok tidak boleh negatif');
    }
    const barang = await this.findOne(id);
    Object.assign(barang, dto);
    return this.barangRepo.save(barang);
  }

  /**
   * Melakukan soft delete pada barang (mengubah status_aktif menjadi false).
   *
   * Parameter:
   * - id (number): ID barang.
   *
   * Return:
   * - Promise<Barang>: Barang yang telah di-nonaktifkan.
   */
  async softDelete(id: number): Promise<Barang> {
    const barang = await this.findOne(id);
    barang.status_aktif = false;
    return this.barangRepo.save(barang);
  }

  /**
   * Menghapus barang secara permanen dari database.
   *
   * Parameter:
   * - id (number): ID barang.
   *
   * Return:
   * - Promise<void>
   */
  async remove(id: number): Promise<void> {
    const barang = await this.findOne(id);
    await this.barangRepo.remove(barang);
  }

  /**
   * Menambah stok barang berdasarkan ID.
   *
   * Parameter:
   * - id (number): ID barang.
   * - dto (AddStokDto): Data penambahan stok.
   *
   * Return:
   * - Promise<Barang>: Barang dengan stok yang telah diperbarui.
   *
   * Exception:
   * - BadRequestException: Jika barang tidak aktif.
   */
  async addStok(id: number, dto: AddStokDto): Promise<Barang> {
    if (dto.jumlah < 1) {
      throw new BadRequestException('Jumlah penambahan stok minimal 1');
    }
    const barang = await this.findOne(id);
    if (!barang.status_aktif) {
      throw new BadRequestException('Barang tidak aktif');
    }
    barang.stok = (barang.stok ?? 0) + dto.jumlah;
    return this.barangRepo.save(barang);
  }

  /**
   * Mengambil daftar barang yang stoknya kritis dan masih aktif.
   *
   * Return:
   * - Promise<Barang[]>: Daftar barang dengan stok kritis.
   */
  async getStokKritis(): Promise<Barang[]> {
    return this.barangRepo
      .createQueryBuilder('barang')
      .where('barang.stok <= barang.ambang_batas_kritis')
      .andWhere('barang.status_aktif = :aktif', { aktif: true })
      .getMany();
  }

  /**
   * Mengambil daftar barang kritis (stok di bawah ambang batas) dan mengurutkan berdasarkan stok.
   *
   * Return:
   * - Promise<Barang[]>: Daftar barang kritis terurut.
   */
  async getBarangKritis(): Promise<Barang[]> {
    return this.barangRepo
      .createQueryBuilder('barang')
      .where('barang.stok <= barang.ambang_batas_kritis')
      .andWhere('barang.status_aktif = :aktif', { aktif: true })
      .orderBy('barang.stok', 'ASC')
      .getMany();
  }

  /**
   * Menghasilkan laporan penggunaan barang dalam format PDF untuk periode tertentu.
   *
   * Parameter:
   * - start (string): Tanggal awal periode (format: YYYY-MM-DD).
   * - end (string): Tanggal akhir periode (format: YYYY-MM-DD).
   * - unitKerja (string, optional): Unit kerja yang akan difilter.
   *
   * Return:
   * - Promise<Buffer>: Buffer PDF laporan penggunaan barang.
   */
  async generateLaporanPenggunaanPDF(
    start: string,
    end: string,
    unitKerja?: string,
  ): Promise<Buffer> {
    try {
      const penggunaan = await this.getLaporanPenggunaanJSON(
        start,
        end,
        unitKerja,
      );

      /**
       * Fungsi untuk memformat tanggal ke format Indonesia.
       */
      const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        // Format tanggal menjadi "DD/MM/YYYY"
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.getMonth() + 1; // Bulan dimulai dari 0, sehingga perlu +1
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      // Format untuk tampilan periode di header (tetap gunakan format lengkap)
      const formatDateFull = (dateStr: string): string => {
        const date = new Date(dateStr);
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
      const currentDateString = formatDateFull(
        today.toISOString().split('T')[0],
      );
      const startFormatted = formatDateFull(start);
      const endFormatted = formatDateFull(end);

      // Konfigurasi font untuk PDF
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

      // Path logo BPS
      const logoPath = path.join(
        __dirname,
        '../assets/images/logo-bps-pringsewu.png',
      );

      // Siapkan data untuk tabel laporan
      const bodyRows =
        penggunaan.length > 0
          ? penggunaan.map((row, index) => [
              { text: index + 1, alignment: 'center' },
              row.nama_barang,
              { text: row.kode_barang, alignment: 'center' },
              { text: row.total_digunakan, alignment: 'center' },
              row.satuan,
              { text: formatDate(row.tanggal_permintaan), alignment: 'center' }, // Format tanggal permintaan menjadi DD/MM/YYYY
            ])
          : [
              [
                {
                  text: 'Tidak ada data penggunaan barang dalam periode ini',
                  colSpan: 6,
                  alignment: 'center',
                },
                {},
                {},
                {},
                {},
                {},
              ],
            ];

      // Definisi dokumen PDF
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
            text: 'Laporan Penggunaan',
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
          unitKerja
            ? {
                text: unitKerja,
                style: 'unitKerja',
                margin: [0, 0, 0, 20],
              }
            : {},
          {
            columns: [
              {
                width: '100%',
                text: [
                  { text: 'Periode: ', style: 'labelInfo' },
                  {
                    text: `${startFormatted} s/d ${endFormatted}`,
                    style: 'valueInfo',
                  },
                ],
                alignment: 'center',
              },
            ],
            margin: [0, 0, 0, 20],
          },
          {
            table: {
              headerRows: 1,
              widths: [30, '*', 70, 60, 50, 80],
              body: [
                [
                  { text: 'No', style: 'tableHeader' },
                  { text: 'Nama Barang', style: 'tableHeader' },
                  { text: 'Kode Barang', style: 'tableHeader' },
                  { text: 'Jumlah', style: 'tableHeader' },
                  { text: 'Satuan', style: 'tableHeader' },
                  { text: 'Tanggal Permintaan', style: 'tableHeader' }, // ubah header
                ],
                ...bodyRows,
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
                    text: `\n\n\n`,
                    margin: [0, 20, 0, 15],
                  },
                  { text: 'Kasubag Umum', margin: [0, 0, 0, 40] },
                  { text: 'Ambriyanto, S.E.', fontSize: 12 },
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
                  { text: 'Kepala BPS Pringsewu', margin: [0, 0, 0, 40] },
                  { text: 'Dr. Budi Pranoto, M.Si', fontSize: 12 },
                ],
                alignment: 'left',
              },
            ],
          },
        ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            color: '#000000',
          },
          unitKerja: {
            fontSize: 12,
            bold: true,
            color: '#000000',
          },
          tableHeader: {
            bold: true,
            fontSize: 10,
            fillColor: '#f1f5f9',
            color: '#000000',
            alignment: 'center',
            margin: [0, 4],
          },
          labelInfo: {
            fontSize: 10,
            color: '#000000',
          },
          valueInfo: {
            fontSize: 10,
            bold: true,
            color: '#000000',
          },
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
        pdfDoc.on('error', (err) => {
          console.error('PDF generation error:', err);
          reject(err);
        });
        pdfDoc.end();
      });
    } catch (error) {
      console.error('Error in PDF generation:', error);
      throw error;
    }
  }

  /**
   * Mengambil rekap penggunaan barang dalam format JSON untuk periode tertentu.
   *
   * Parameter:
   * - start (string): Tanggal awal periode (format: YYYY-MM-DD).
   * - end (string): Tanggal akhir periode (format: YYYY-MM-DD).
   * - unitKerja (string, optional): Unit kerja yang akan difilter.
   *
   * Return:
   * - Promise<any[]>: Array rekap penggunaan barang.
   *
   * Exception:
   * - BadRequestException: Jika format tanggal salah atau rentang tidak valid.
   */
  async getLaporanPenggunaanJSON(
    start: string,
    end: string,
    unitKerja?: string,
  ): Promise<any[]> {
    // Validasi format tanggal
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(start) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(end)
    ) {
      throw new BadRequestException('Format tanggal harus YYYY-MM-DD');
    }

    // Validasi rentang tanggal
    if (new Date(start) > new Date(end)) {
      throw new BadRequestException('Tanggal mulai harus <= tanggal akhir');
    }

    // Query rekap penggunaan barang berdasarkan permintaan yang sudah diverifikasi
    const qb = this.dataSource
      .createQueryBuilder()
      .select([
        'b.nama_barang AS nama_barang',
        'b.kode_barang AS kode_barang',
        'b.satuan AS satuan',
        'SUM(dp.jumlah_disetujui) AS total_digunakan',
        'u.unit_kerja AS unit_kerja',
        'MIN(p.tanggal_permintaan) AS tanggal_permintaan', // ambil tanggal permintaan paling awal
      ])
      .from('detail_permintaan', 'dp')
      .innerJoin('barang', 'b', 'dp.id_barang = b.id')
      .innerJoin('permintaan', 'p', 'dp.id_permintaan = p.id')
      .innerJoin('users', 'u', 'p.id_user_pemohon = u.id')
      .where('p.status IN (:...statuses)', {
        statuses: ['Disetujui', 'Disetujui Sebagian'],
      })
      .andWhere('p.tanggal_verifikasi >= :start', { start })
      .andWhere('p.tanggal_verifikasi <= :end', { end })
      .andWhere('dp.jumlah_disetujui > 0')
      .groupBy('b.nama_barang')
      .addGroupBy('b.kode_barang')
      .addGroupBy('b.satuan')
      .addGroupBy('u.unit_kerja')
      .orderBy('b.nama_barang', 'ASC');

    // Filter unit kerja jika diberikan
    if (unitKerja) {
      qb.andWhere('u.unit_kerja = :unitKerja', { unitKerja });
    }

    return qb.getRawMany();
  }
}
