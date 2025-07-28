import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
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
}
