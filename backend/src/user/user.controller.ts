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
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';

@Controller('user')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Endpoint khusus admin
  @Roles('admin')
  @Get('admin-only')
  getAdminData() {
    return { message: 'Data khusus admin' };
  }

  // Endpoint khusus pegawai
  @Roles('pegawai')
  @Get('pegawai-only')
  getPegawaiData() {
    return { message: 'Data khusus pegawai' };
  }

  // Endpoint bisa diakses semua user yang sudah login (tanpa role spesifik)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const userId = (req.user as any)?.userId;
    return this.userService.findOne(userId);
  }

  @Patch('profile')
  async updateProfile(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const userId = (req.user as any)?.userId;
    return this.userService.update(userId, dto);
  }

  // CRUD user hanya untuk admin
  @Roles('admin')
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Roles('admin')
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Roles('admin')
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.softDelete(id);
  }

  // Endpoint untuk hapus user by username (khusus testing/dev)
  @Roles('admin')
  @Delete()
  async deleteByUsername(@Body() body: { username: string }) {
    const user = await this.userService.findByUsername(body.username);
    if (!user) return { message: 'User tidak ditemukan' };
    return this.userService.softDelete(user.id);
  }
}
