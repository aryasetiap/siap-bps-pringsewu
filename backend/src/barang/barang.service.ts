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
import { AddStokDto } from './dto/add-stok.dto';
import * as PdfPrinter from 'pdfmake';
import * as path from 'path';

@Injectable()
export class BarangService {
  constructor(
    @InjectRepository(Barang)
    private barangRepo: Repository<Barang>,
  ) {}

  /**
   * Membuat data barang baru.
   * @param dto Data barang yang akan dibuat.
   * @returns Barang yang berhasil dibuat.
   * @throws BadRequestException jika kode barang sudah terdaftar.
   */
  async create(dto: CreateBarangDto): Promise<Barang> {
    const exist = await this.barangRepo.findOne({
      where: { kode_barang: dto.kode_barang },
    });
    if (exist) throw new BadRequestException('Kode barang sudah terdaftar');
    const barang = this.barangRepo.create({ ...dto, status_aktif: true });
    return this.barangRepo.save(barang);
  }

  /**
   * Mengambil daftar barang dengan filter pencarian, status aktif, dan stok kritis.
   * @param query Opsi pencarian: q (nama/kode), status_aktif, stok_kritis.
   * @returns Daftar barang sesuai filter.
   */
  async findAll(query?: {
    q?: string;
    status_aktif?: boolean;
    stok_kritis?: boolean;
  }): Promise<Barang[]> {
    const repo = this.barangRepo;
    const qb = repo.createQueryBuilder('barang');

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
   * @param id ID barang.
   * @returns Barang yang ditemukan.
   * @throws NotFoundException jika barang tidak ditemukan.
   */
  async findOne(id: number): Promise<Barang> {
    const barang = await this.barangRepo.findOne({ where: { id } });
    if (!barang) throw new NotFoundException('Barang tidak ditemukan');
    return barang;
  }

  /**
   * Memperbarui data barang berdasarkan ID.
   * @param id ID barang.
   * @param dto Data yang akan diperbarui.
   * @returns Barang yang telah diperbarui.
   * @throws BadRequestException jika stok negatif.
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
   * @param id ID barang.
   * @returns Barang yang telah di-nonaktifkan.
   */
  async softDelete(id: number): Promise<Barang> {
    const barang = await this.findOne(id);
    barang.status_aktif = false;
    return this.barangRepo.save(barang);
  }

  /**
   * Menghapus barang secara permanen dari database.
   * @param id ID barang.
   * @returns void
   */
  async remove(id: number): Promise<void> {
    const barang = await this.findOne(id);
    await this.barangRepo.remove(barang);
  }

  /**
   * Menambah stok barang berdasarkan ID.
   * @param id ID barang.
   * @param dto Data penambahan stok.
   * @returns Barang dengan stok yang telah diperbarui.
   * @throws BadRequestException jika barang tidak aktif.
   */
  async addStok(id: number, dto: AddStokDto): Promise<Barang> {
    const barang = await this.findOne(id);
    if (!barang.status_aktif)
      throw new BadRequestException('Barang tidak aktif');
    barang.stok = (barang.stok ?? 0) + dto.jumlah;
    return this.barangRepo.save(barang);
  }

  /**
   * Mengambil daftar barang yang stoknya kritis dan masih aktif.
   * @returns Daftar barang dengan stok kritis.
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
   * @returns Daftar barang kritis terurut.
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
   * @param start Tanggal awal periode (format: YYYY-MM-DD).
   * @param end Tanggal akhir periode (format: YYYY-MM-DD).
   * @returns Buffer PDF laporan penggunaan barang.
   */
  async generateLaporanPenggunaanPDF(
    start: string,
    end: string,
  ): Promise<Buffer> {
    const penggunaan = await this.barangRepo.query(
      `
      SELECT b.nama_barang, b.satuan, SUM(d.jumlah_disetujui) as total_digunakan
      FROM detail_permintaan d
      JOIN barang b ON d.id_barang = b.id
      JOIN permintaan p ON d.id_permintaan = p.id
      WHERE p.status IN ('Disetujui', 'Disetujui Sebagian')
        AND p.tanggal_permintaan BETWEEN $1 AND $2
      GROUP BY b.nama_barang, b.satuan
      ORDER BY b.nama_barang
    `,
      [start, end],
    );

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

    const bodyRows =
      penggunaan.length > 0
        ? penggunaan.map((row) => [
            row.nama_barang,
            row.total_digunakan,
            row.satuan,
          ])
        : [
            [
              { text: 'Tidak ada data', colSpan: 3, alignment: 'center' },
              {},
              {},
            ],
          ];

    const docDefinition = {
      content: [
        { text: 'Laporan Penggunaan Barang', style: 'header' },
        { text: `Periode: ${start} s/d ${end}`, margin: [0, 10, 0, 10] },
        {
          table: {
            headerRows: 1,
            widths: ['*', 60, 60],
            body: [
              [
                { text: 'Nama Barang', style: 'tableHeader' },
                { text: 'Total Digunakan', style: 'tableHeader' },
                { text: 'Satuan', style: 'tableHeader' },
              ],
              ...bodyRows,
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
