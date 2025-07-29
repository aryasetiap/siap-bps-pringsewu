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
 * Controller untuk manajemen data barang.
 * Mengatur endpoint terkait CRUD barang, stok, notifikasi, dan laporan.
 */
@Controller('barang')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BarangController {
  constructor(private readonly barangService: BarangService) {}

  /**
   * Membuat data barang baru.
   * Hanya dapat diakses oleh admin.
   *
   * @param dto Data barang yang akan dibuat (CreateBarangDto)
   * @returns Data barang yang berhasil dibuat
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
   * Mengambil daftar seluruh barang dengan opsi filter.
   * Hanya dapat diakses oleh admin.
   *
   * @param q Kata kunci pencarian (opsional)
   * @param status_aktif Filter status aktif barang (opsional)
   * @param stok_kritis Filter barang dengan stok kritis (opsional)
   * @returns Daftar barang sesuai filter yang diberikan
   */
  @Roles('admin')
  @Get()
  findAll(
    @Query('q') q?: string,
    @Query('status_aktif') status_aktif?: string,
    @Query('stok_kritis') stok_kritis?: string,
  ) {
    return this.barangService.findAll({
      q,
      status_aktif:
        status_aktif === undefined ? undefined : status_aktif === 'true',
      stok_kritis: stok_kritis === 'true',
    });
  }

  /**
   * Mengambil daftar barang yang memiliki stok kritis.
   * Hanya dapat diakses oleh admin.
   *
   * @returns Daftar barang dengan stok kritis
   */
  @Roles('admin')
  @Get('stok-kritis')
  async getStokKritis() {
    return this.barangService.getStokKritis();
  }

  /**
   * Mengambil detail barang berdasarkan ID.
   * Hanya dapat diakses oleh admin.
   *
   * @param id ID barang
   * @returns Detail barang yang ditemukan
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
   * @param id ID barang yang akan diperbarui
   * @param dto Data barang yang akan diperbarui (UpdateBarangDto)
   * @returns Data barang yang telah diperbarui
   */
  @Roles('admin')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBarangDto) {
    return this.barangService.update(id, dto);
  }

  /**
   * Melakukan soft delete pada barang berdasarkan ID.
   * Hanya dapat diakses oleh admin.
   *
   * @param id ID barang yang akan dihapus
   * @returns Status penghapusan barang
   */
  @Roles('admin')
  @Delete(':id')
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.barangService.softDelete(id);
  }

  /**
   * Menambah stok pada barang tertentu.
   * Hanya dapat diakses oleh admin.
   *
   * @param id ID barang yang akan ditambah stoknya
   * @param dto Data penambahan stok (AddStokDto)
   * @returns Data barang setelah stok ditambah
   */
  @Roles('admin')
  @Patch(':id/add-stok')
  addStok(@Param('id', ParseIntPipe) id: number, @Body() dto: AddStokDto) {
    return this.barangService.addStok(id, dto);
  }

  /**
   * Mengambil notifikasi barang dengan stok kritis untuk dashboard.
   * Hanya dapat diakses oleh user yang sudah login.
   *
   * @returns Daftar notifikasi barang stok kritis
   */
  @UseGuards(JwtAuthGuard)
  @Get('dashboard/notifikasi-stok-kritis')
  async getNotifikasiStokKritis() {
    return this.barangService.getBarangKritis();
  }

  /**
   * Menghasilkan laporan penggunaan barang dalam format PDF.
   * Hanya dapat diakses oleh user yang sudah login.
   *
   * @param start Tanggal mulai periode laporan (format: YYYY-MM-DD)
   * @param end Tanggal akhir periode laporan (format: YYYY-MM-DD)
   * @param res Response object untuk mengirim file PDF
   * @throws BadRequestException Jika format tanggal tidak valid atau tanggal mulai > tanggal akhir
   * @returns File PDF laporan penggunaan barang
   */
  @Get('laporan-penggunaan/pdf')
  @UseGuards(JwtAuthGuard)
  async generateLaporanPenggunaanPDF(
    @Query('start') start: string,
    @Query('end') end: string,
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
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="laporan_penggunaan_${start}_${end}.pdf"`,
    });
    res.end(pdfBuffer);
  }
}
