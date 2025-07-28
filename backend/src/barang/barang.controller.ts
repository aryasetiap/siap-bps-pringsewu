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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { BarangService } from './barang.service';
import { CreateBarangDto } from './dto/create-barang.dto';
import { UpdateBarangDto } from './dto/update-barang.dto';
import { AddStokDto } from './dto/add-stok.dto';

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

  // Hapus permanen (opsional, untuk admin superuser)
  // @Roles('admin')
  // @Delete(':id/permanent')
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.barangService.remove(id);
  // }
}
