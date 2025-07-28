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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { BarangService } from './barang.service';
import { CreateBarangDto } from './dto/create-barang.dto';
import { UpdateBarangDto } from './dto/update-barang.dto';

@Controller('barang')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BarangController {
  constructor(private readonly barangService: BarangService) {}

  @Roles('admin')
  @Post()
  create(@Body() dto: CreateBarangDto) {
    return this.barangService.create(dto);
  }

  @Roles('admin')
  @Get()
  findAll() {
    return this.barangService.findAll();
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

  // Hapus permanen (opsional, untuk admin superuser)
  // @Roles('admin')
  // @Delete(':id/permanent')
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.barangService.remove(id);
  // }
}
