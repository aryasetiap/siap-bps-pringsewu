import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  ForbiddenException, // tambahkan ini
} from '@nestjs/common';
import { PermintaanService } from './permintaan.service';
import { CreatePermintaanDto } from './dto/create-permintaan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('permintaan')
export class PermintaanController {
  constructor(private readonly permintaanService: PermintaanService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('pegawai')
  @Post()
  async create(@Body() dto: CreatePermintaanDto, @Req() req) {
    // INI PERBAIKANNYA: Gunakan req.user.userId
    return this.permintaanService.create(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('pegawai')
  @Get('riwayat')
  async getRiwayat(@Req() req) {
    // Hanya tampilkan permintaan milik user login
    return this.permintaanService.getRiwayatByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('masuk')
  async getPermintaanMasuk(@Req() req) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Hanya admin yang dapat mengakses');
    }
    return this.permintaanService.getPermintaanMenunggu();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Req() req, @Param('id') id: number) {
    // Hanya boleh akses permintaan milik sendiri (pegawai) atau admin
    const permintaan = await this.permintaanService.findOneById(Number(id));
    if (
      req.user.role === 'pegawai' &&
      permintaan.id_user_pemohon !== req.user.userId
    ) {
      throw new ForbiddenException('Akses ditolak');
    }
    return permintaan;
  }
}
