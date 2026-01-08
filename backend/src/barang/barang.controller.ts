/**
 * File: barang.controller.ts
 *
 * Controller untuk manajemen data barang pada aplikasi SIAP.
 * Mengatur endpoint terkait CRUD barang, stok, notifikasi, dan laporan.
 * Seluruh endpoint telah dilindungi oleh mekanisme autentikasi dan otorisasi.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
  Query,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { BarangService } from './barang.service';
import { CreateBarangDto } from './dto/create-barang.dto';
import { UpdateBarangDto } from './dto/update-barang.dto';
import { AddStokDto } from './dto/add-stok.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

/**
 * Controller utama untuk pengelolaan data barang.
 */
@Controller('barang')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BarangController {
  /**
   * Konstruktor controller barang.
   *
   * Parameter:
   * - barangService (BarangService): Service untuk logika bisnis barang.
   */
  constructor(private readonly barangService: BarangService) {}

  /**
   * Membuat data barang baru.
   * Hanya dapat diakses oleh admin.
   *
   * Parameter:
   * - dto (CreateBarangDto): Data barang yang akan dibuat.
   *
   * Return:
   * - Promise<object>: Data barang yang berhasil dibuat.
   */
  @Roles('admin')
  @Post()
  create(
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    dto: CreateBarangDto,
  ) {
    return this.barangService.create(dto);
  }

  /**
   * Mengambil daftar seluruh barang dengan opsi filter dan pagination.
   * Bisa difilter berdasarkan status aktif dan stok kritis.
   * Hanya dapat diakses oleh admin dan pegawai.
   *
   * Parameter:
   * - q (string, opsional): Kata kunci pencarian barang.
   * - status_aktif (string, opsional): Filter status aktif barang.
   * - stok_kritis (string, opsional): Filter barang dengan stok kritis.
   * - page (string, opsional): Nomor halaman (default: 1).
   * - limit (string, opsional): Jumlah data per halaman (default: 20).
   * - paginate (string, opsional): Aktifkan pagination (default: true).
   *
   * Return:
   * - Promise<object>: Data barang dengan info pagination atau array barang.
   */
  @Roles('admin', 'pegawai')
  @Get()
  async findAll(
    @Query('q') q?: string,
    @Query('status_aktif') status_aktif?: string,
    @Query('stok_kritis') stok_kritis?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('paginate') paginate?: string,
  ) {
    const shouldPaginate = paginate !== 'false';

    if (shouldPaginate) {
      return this.barangService.findAll({
        q,
        status_aktif:
          status_aktif === undefined ? undefined : status_aktif === 'true',
        stok_kritis: stok_kritis === 'true',
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20,
      });
    } else {
      // Untuk backward compatibility dengan endpoint yang tidak menggunakan pagination
      const data = await this.barangService.findAllWithoutPagination({
        q,
        status_aktif:
          status_aktif === undefined ? undefined : status_aktif === 'true',
        stok_kritis: stok_kritis === 'true',
      });
      return data;
    }
  }

  /**
   * Mengambil daftar barang yang memiliki stok kritis.
   * Digunakan untuk monitoring stok barang yang perlu segera ditambah.
   *
   * Return:
   * - Promise<object[]>: Daftar barang dengan stok kritis.
   */
  @Roles('admin')
  @Get('stok-kritis')
  async getStokKritis() {
    return this.barangService.getStokKritis();
  }

  /**
   * Mengambil notifikasi barang dengan stok kritis untuk dashboard.
   * Hanya dapat diakses oleh user yang sudah login.
   *
   * Return:
   * - Promise<object[]>: Daftar notifikasi barang kritis.
   */
  @UseGuards(JwtAuthGuard)
  @Get('dashboard/notifikasi-stok-kritis')
  async getNotifikasiStokKritis() {
    return this.barangService.getBarangKritis();
  }

  /**
   * Mengambil rekap penggunaan barang dalam format JSON untuk periode tertentu.
   * Validasi format tanggal dan urutan tanggal dilakukan sebelum pemrosesan.
   *
   * Parameter:
   * - start (string): Tanggal mulai (format YYYY-MM-DD).
   * - end (string): Tanggal akhir (format YYYY-MM-DD).
   * - unitKerja (string): Unit kerja terkait laporan.
   *
   * Return:
   * - Promise<object[]>: Rekap penggunaan barang dalam periode tertentu.
   */
  @Get('laporan-penggunaan')
  @UseGuards(JwtAuthGuard)
  async getLaporanPenggunaanJSON(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('unit_kerja') unitKerja: string,
  ) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(start) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(end)
    ) {
      throw new BadRequestException('Format tanggal harus YYYY-MM-DD');
    }
    if (new Date(start) > new Date(end)) {
      throw new BadRequestException('Tanggal mulai harus <= tanggal akhir');
    }
    return await this.barangService.getLaporanPenggunaanJSON(
      start,
      end,
      unitKerja,
    );
  }

  /**
   * Menghasilkan laporan penggunaan barang dalam format PDF.
   * Validasi format tanggal dan urutan tanggal dilakukan sebelum pemrosesan.
   *
   * Parameter:
   * - start (string): Tanggal mulai (format YYYY-MM-DD).
   * - end (string): Tanggal akhir (format YYYY-MM-DD).
   * - unitKerja (string): Unit kerja terkait laporan.
   * - res (Response): Response object untuk mengirim file PDF.
   *
   * Return:
   * - void: File PDF dikirim sebagai response.
   */
  @Get('laporan-penggunaan/pdf')
  @UseGuards(JwtAuthGuard)
  async generateLaporanPenggunaanPDF(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('unit_kerja') unitKerja: string,
    @Res() res: Response,
  ) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(start) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(end)
    ) {
      throw new BadRequestException('Format tanggal harus YYYY-MM-DD');
    }
    if (new Date(start) > new Date(end)) {
      throw new BadRequestException('Tanggal mulai harus <= tanggal akhir');
    }

    const pdfBuffer = await this.barangService.generateLaporanPenggunaanPDF(
      start,
      end,
      unitKerja,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="laporan_penggunaan_${start}_${end}.pdf"`,
    });
    res.end(pdfBuffer);
  }

  /**
   * Mengambil daftar barang yang tersedia untuk permintaan pegawai.
   * Hanya menampilkan barang dengan status aktif tanpa pagination.
   */
  @Get('available')
  @Roles('pegawai')
  getAvailableBarang() {
    return this.barangService.findAllWithoutPagination({
      status_aktif: true,
    });
  }

  /**
   * Mengambil detail barang berdasarkan ID.
   * Hanya dapat diakses oleh admin.
   *
   * Parameter:
   * - id (number): ID barang yang ingin diambil.
   *
   * Return:
   * - Promise<object>: Detail barang.
   */
  @Roles('admin')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.barangService.findOne(id);
  }

  /**
   * Memperbarui data barang berdasarkan ID.
   * Hanya dapat diakses oleh admin.
   *
   * Parameter:
   * - id (number): ID barang yang ingin diperbarui.
   * - dto (UpdateBarangDto): Data barang yang akan diperbarui.
   *
   * Return:
   * - Promise<object>: Data barang yang telah diperbarui.
   */
  @Roles('admin')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBarangDto) {
    return this.barangService.update(id, dto);
  }

  /**
   * Menambah stok pada barang tertentu.
   * Hanya dapat diakses oleh admin.
   *
   * Parameter:
   * - id (number): ID barang yang akan ditambah stoknya.
   * - dto (AddStokDto): Data penambahan stok.
   *
   * Return:
   * - Promise<object>: Data barang setelah penambahan stok.
   */
  @Roles('admin')
  @Patch(':id/add-stok')
  addStok(@Param('id', ParseIntPipe) id: number, @Body() dto: AddStokDto) {
    return this.barangService.addStok(id, dto);
  }

  /**
   * Melakukan soft delete pada barang berdasarkan ID.
   * Barang tidak dihapus permanen, hanya status aktif diubah.
   * Hanya dapat diakses oleh admin.
   *
   * Parameter:
   * - id (number): ID barang yang akan dihapus.
   *
   * Return:
   * - Promise<object>: Data barang setelah dihapus (soft delete).
   */
  @Roles('admin')
  @Delete(':id')
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.barangService.softDelete(id);
  }
}
