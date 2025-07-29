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

@Controller('barang')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BarangController {
  constructor(private readonly barangService: BarangService) {}

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

  @Roles('admin')
  @Get('stok-kritis')
  async getStokKritis() {
    return this.barangService.getStokKritis();
  }

  @Roles('admin')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.barangService.findOne(id);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBarangDto) {
    return this.barangService.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.barangService.softDelete(id);
  }

  @Roles('admin')
  @Patch(':id/add-stok')
  addStok(@Param('id', ParseIntPipe) id: number, @Body() dto: AddStokDto) {
    return this.barangService.addStok(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard/notifikasi-stok-kritis')
  async getNotifikasiStokKritis() {
    return this.barangService.getBarangKritis();
  }

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

  // Hapus permanen (opsional, untuk admin superuser)
  // @Roles('admin')
  // @Delete(':id/permanent')
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.barangService.remove(id);
  // }
}
