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
   */
  @Roles('admin', 'pegawai')
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

  // --- RUTE STATIS (DEFINISIKAN SEBELUM RUTE DINAMIS) ---

  /**
   * Mengambil daftar barang yang memiliki stok kritis.
   */
  @Roles('admin')
  @Get('stok-kritis')
  async getStokKritis() {
    return this.barangService.getStokKritis();
  }

  /**
   * Mengambil notifikasi barang dengan stok kritis untuk dashboard.
   */
  @UseGuards(JwtAuthGuard)
  @Get('dashboard/notifikasi-stok-kritis')
  async getNotifikasiStokKritis() {
    return this.barangService.getBarangKritis();
  }

  /**
   * Mengambil rekap penggunaan barang dalam format JSON untuk periode tertentu.
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
   * Hanya menampilkan barang dengan status aktif.
   */
  @Get('available')
  @Roles('pegawai')
  getAvailableBarang() {
    // Filter untuk mendapatkan hanya barang yang aktif
    return this.barangService.findAll({
      status_aktif: true,
    });
  }

  // --- RUTE DINAMIS (DEFINISIKAN SETELAH RUTE STATIS) ---

  /**
   * Mengambil detail barang berdasarkan ID.
   */
  @Roles('admin')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.barangService.findOne(id);
  }

  /**
   * Memperbarui data barang berdasarkan ID.
   */
  @Roles('admin')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBarangDto) {
    return this.barangService.update(id, dto);
  }

  /**
   * Menambah stok pada barang tertentu.
   */
  @Roles('admin')
  @Patch(':id/add-stok')
  addStok(@Param('id', ParseIntPipe) id: number, @Body() dto: AddStokDto) {
    return this.barangService.addStok(id, dto);
  }

  /**
   * Melakukan soft delete pada barang berdasarkan ID.
   */
  @Roles('admin')
  @Delete(':id')
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.barangService.softDelete(id);
  }
}
