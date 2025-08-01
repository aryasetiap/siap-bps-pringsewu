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
} from '@nestjs/common';
import { PermintaanService } from './permintaan.service';
import { CreatePermintaanDto } from './dto/create-permintaan.dto';
import { VerifikasiPermintaanDto } from './dto/verifikasi-permintaan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Response } from 'express';

@Controller('permintaan')
export class PermintaanController {
  constructor(private readonly permintaanService: PermintaanService) {}

  /**
   * Membuat permintaan baru oleh pegawai.
   * @param dto Data permintaan yang akan dibuat.
   * @param req Request yang berisi informasi user login.
   * @returns Data permintaan yang berhasil dibuat.
   */
  @UseGuards(JwtAuthGuard)
  @Roles('pegawai')
  @Post()
  async create(@Body() dto: CreatePermintaanDto, @Req() req) {
    return this.permintaanService.create(dto, req.user.userId);
  }

  /**
   * Mengambil riwayat permintaan milik user yang sedang login.
   * @param req Request yang berisi informasi user login.
   * @returns Daftar permintaan milik user.
   */
  @UseGuards(JwtAuthGuard)
  @Roles('pegawai')
  @Get('riwayat')
  async getRiwayat(@Req() req) {
    return this.permintaanService.getRiwayatByUser(req.user.userId);
  }

  /**
   * Mengambil daftar permintaan yang masuk (hanya untuk admin).
   * @param req Request yang berisi informasi user login.
   * @returns Daftar permintaan yang menunggu verifikasi.
   * @throws ForbiddenException Jika user bukan admin.
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
   * @param id ID permintaan yang akan diverifikasi.
   * @param dto Data verifikasi permintaan.
   * @param req Request yang berisi informasi user login.
   * @returns Hasil verifikasi permintaan.
   */
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Patch(':id/verifikasi')
  async verifikasi(
    @Param('id') id: number,
    @Body() dto: VerifikasiPermintaanDto,
    @Req() req,
  ) {
    return this.permintaanService.verifikasiPermintaan(
      Number(id),
      dto,
      req.user.userId,
    );
  }

  /**
   * Mengambil statistik dashboard permintaan (hanya untuk admin).
   * @returns Data statistik permintaan.
   */
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Get('dashboard/statistik')
  async getDashboardStatistik() {
    return this.permintaanService.getDashboardStatistik();
  }

  /**
   * Mengambil tren permintaan bulanan untuk dashboard (hanya untuk admin).
   * @returns Data tren permintaan bulanan.
   */
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Get('dashboard/tren-permintaan')
  async getTrenPermintaanBulanan() {
    return this.permintaanService.getTrenPermintaanBulanan();
  }

  /**
   * Menghasilkan file PDF bukti permintaan berdasarkan ID.
   * @param id ID permintaan.
   * @param res Response untuk mengirim file PDF.
   * @returns File PDF bukti permintaan.
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/pdf')
  async generateBuktiPermintaanPDF(
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.permintaanService.generateBuktiPermintaanPDF(
      Number(id),
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="bukti_permintaan_${id}.pdf"`,
    });
    res.end(pdfBuffer);
  }

  /**
   * Mengambil semua permintaan dengan opsi filter dan paginasi (hanya untuk admin).
   * @param status Status permintaan yang akan difilter.
   * @param page Halaman yang akan diambil (default: 1).
   * @param limit Jumlah data per halaman (default: 20).
   * @returns Daftar semua permintaan yang sesuai dengan filter.
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
