/**
 * File: permintaan.controller.ts
 *
 * Controller untuk mengelola permintaan barang pada aplikasi SIAP.
 * Berisi endpoint untuk membuat, mengambil, memverifikasi, dan mengelola permintaan barang.
 * Seluruh endpoint telah dilindungi dengan JWT dan role-based access control.
 */

import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  ForbiddenException,
  Patch,
  Res,
  Query,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { PermintaanService } from './permintaan.service';
import { CreatePermintaanDto } from './dto/create-permintaan.dto';
import { VerifikasiPermintaanDto } from './dto/verifikasi-permintaan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Response } from 'express';

/**
 * Controller utama untuk pengelolaan permintaan barang.
 *
 * Fitur:
 * - Membuat permintaan barang oleh pegawai
 * - Mengambil riwayat permintaan user
 * - Mengambil daftar permintaan masuk (admin)
 * - Memverifikasi permintaan (admin)
 * - Mengambil statistik dan tren permintaan (admin)
 * - Menghasilkan bukti permintaan dalam bentuk PDF
 * - Mengambil semua permintaan dengan filter dan paginasi (admin)
 * - Mengambil detail permintaan tertentu
 */
@Controller('permintaan')
export class PermintaanController {
  constructor(private readonly permintaanService: PermintaanService) {}

  /**
   * Membuat permintaan baru oleh pegawai.
   *
   * Parameter:
   * - dto (CreatePermintaanDto): Data permintaan yang akan dibuat
   * - req (Request): Request yang berisi informasi user login
   *
   * Return:
   * - Promise<any>: Data permintaan yang berhasil dibuat
   */
  @UseGuards(JwtAuthGuard)
  @Roles('pegawai')
  @Post()
  async create(@Body() dto: CreatePermintaanDto, @Req() req) {
    return this.permintaanService.create(dto, req.user.userId);
  }

  /**
   * Mengambil riwayat permintaan milik user yang sedang login.
   *
   * Parameter:
   * - req (Request): Request yang berisi informasi user login
   *
   * Return:
   * - Promise<any[]>: Daftar permintaan milik user
   */
  @UseGuards(JwtAuthGuard)
  @Roles('pegawai')
  @Get('riwayat')
  async getRiwayat(@Req() req) {
    return this.permintaanService.getRiwayatByUser(req.user.userId);
  }

  /**
   * Mengambil daftar permintaan yang masuk (hanya untuk admin).
   *
   * Parameter:
   * - req (Request): Request yang berisi informasi user login
   *
   * Return:
   * - Promise<any[]>: Daftar permintaan yang menunggu verifikasi
   *
   * Throws:
   * - ForbiddenException: Jika user bukan admin
   */
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Get('masuk')
  async getPermintaanMasuk(@Req() req) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Hanya admin yang dapat mengakses');
    }
    return this.permintaanService.getPermintaanMenunggu();
  }

  /**
   * Memverifikasi permintaan (hanya untuk admin).
   *
   * Parameter:
   * - id (number): ID permintaan yang akan diverifikasi
   * - dto (VerifikasiPermintaanDto): Data verifikasi permintaan
   * - req (Request): Request yang berisi informasi user login
   *
   * Return:
   * - Promise<any>: Hasil verifikasi permintaan
   */
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Patch(':id/verifikasi')
  async verifikasi(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: VerifikasiPermintaanDto,
    @Req() req,
  ) {
    return this.permintaanService.verifikasiPermintaan(
      id,
      dto,
      req.user.userId,
    );
  }

  /**
   * Mengambil statistik dashboard permintaan (hanya untuk admin).
   *
   * Return:
   * - Promise<any>: Data statistik permintaan
   */
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Get('dashboard/statistik')
  async getDashboardStatistik() {
    return this.permintaanService.getDashboardStatistik();
  }

  /**
   * Mengambil tren permintaan bulanan untuk dashboard (hanya untuk admin).
   *
   * Return:
   * - Promise<any>: Data tren permintaan bulanan
   */
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Get('dashboard/tren-permintaan')
  async getTrenPermintaanBulanan() {
    return this.permintaanService.getTrenPermintaanBulanan();
  }

  /**
   * Menghasilkan file PDF bukti permintaan berdasarkan ID.
   *
   * Parameter:
   * - id (number): ID permintaan
   * - res (Response): Response untuk mengirim file PDF
   * - req (Request): Request yang berisi informasi user login
   *
   * Return:
   * - void: Mengirim file PDF sebagai response
   *
   * Throws:
   * - ForbiddenException: Jika user tidak berhak mengakses PDF
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/pdf')
  async generateBuktiPermintaanPDF(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
    @Req() req: any,
  ) {
    // Validasi hak akses user terhadap permintaan
    const permintaan = await this.permintaanService.findOneById(id);
    if (
      req.user.role !== 'admin' &&
      permintaan.id_user_pemohon !== req.user.userId
    ) {
      throw new ForbiddenException(
        'Anda tidak berhak mengakses bukti permintaan ini',
      );
    }

    const pdfBuffer =
      await this.permintaanService.generateBuktiPermintaanPDF(id);

    // Format tanggal untuk nama file bukti
    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="bukti_permintaan_${id}_${dateStr}.pdf"`,
    });
    res.end(pdfBuffer);
  }

  /**
   * Mengambil semua permintaan dengan opsi filter dan paginasi (hanya untuk admin).
   *
   * Parameter:
   * - status (string, optional): Status permintaan yang akan difilter
   * - page (number, default: 1): Halaman yang akan diambil
   * - limit (number, default: 20): Jumlah data per halaman
   *
   * Return:
   * - Promise<any[]>: Daftar semua permintaan yang sesuai dengan filter
   */
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Get('all')
  async getAllPermintaan(
    @Query('status') status?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.permintaanService.getAllPermintaan({ status, page, limit });
  }

  /**
   * Mengambil detail permintaan berdasarkan ID.
   *
   * Parameter:
   * - req (Request): Request yang berisi informasi user login
   * - id (string): ID permintaan
   *
   * Return:
   * - Promise<any>: Data permintaan yang ditemukan
   *
   * Throws:
   * - BadRequestException: Jika ID tidak valid
   * - ForbiddenException: Jika user tidak berhak mengakses data permintaan
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string) {
    const idNum = Number(id);
    if (!idNum || isNaN(idNum)) {
      throw new BadRequestException('ID permintaan tidak valid');
    }
    const permintaan = await this.permintaanService.findOneById(idNum);
    if (
      req.user.role === 'pegawai' &&
      permintaan.id_user_pemohon !== req.user.userId
    ) {
      throw new ForbiddenException('Akses ditolak');
    }
    return permintaan;
  }
}
