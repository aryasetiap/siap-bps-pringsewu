/**
 * File: user.controller.ts
 *
 * Controller untuk mengelola data user pada aplikasi SIAP.
 * Berfungsi untuk menangani permintaan terkait user seperti pembuatan, pembaruan, penghapusan, dan pengelolaan profil.
 * Seluruh endpoint dilindungi oleh autentikasi JWT dan otorisasi berbasis peran (admin/pegawai).
 */

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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

/**
 * Controller utama untuk pengelolaan user di aplikasi SIAP.
 * Seluruh endpoint menggunakan guard autentikasi dan otorisasi.
 */
@Controller('user')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  /**
   * Konstruktor untuk inisialisasi service user.
   *
   * Parameter:
   * - userService (UserService): Service untuk operasi data user.
   */
  constructor(private readonly userService: UserService) {}

  /**
   * Endpoint khusus admin untuk mengambil data spesifik admin.
   *
   * Return:
   * - object: Pesan khusus admin.
   */
  @Roles('admin')
  @Get('admin-only')
  getAdminData() {
    return { message: 'Data khusus admin' };
  }

  /**
   * Endpoint khusus pegawai untuk mengambil data spesifik pegawai.
   *
   * Return:
   * - object: Pesan khusus pegawai.
   */
  @Roles('pegawai')
  @Get('pegawai-only')
  getPegawaiData() {
    return { message: 'Data khusus pegawai' };
  }

  /**
   * Mengambil profil user yang sedang login.
   *
   * Parameter:
   * - req (Request): Request Express yang berisi data user hasil autentikasi.
   *
   * Return:
   * - object: Data user yang sedang login.
   */
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const userId = (req.user as any)?.userId;
    return this.userService.findOne(userId);
  }

  /**
   * Memperbarui profil user yang sedang login.
   *
   * Parameter:
   * - req (Request): Request Express yang berisi data user hasil autentikasi.
   * - dto (UpdateUserDto): Data untuk memperbarui profil user.
   *
   * Return:
   * - object: Data user yang telah diperbarui.
   */
  @Patch('profile')
  async updateProfile(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const userId = (req.user as any)?.userId;
    return this.userService.update(userId, dto);
  }

  /**
   * Membuat user baru (khusus admin).
   *
   * Parameter:
   * - dto (CreateUserDto): Data user baru yang akan dibuat.
   *
   * Return:
   * - object: Data user yang telah dibuat.
   */
  @Roles('admin')
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  /**
   * Mengambil seluruh data user (khusus admin).
   *
   * Return:
   * - array: Daftar seluruh user.
   */
  @Roles('admin')
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  /**
   * Mengambil data user berdasarkan ID (khusus admin).
   *
   * Parameter:
   * - id (number): ID user yang akan diambil.
   *
   * Return:
   * - object: Data user yang ditemukan.
   */
  @Roles('admin')
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  /**
   * Memperbarui data user berdasarkan ID (khusus admin).
   *
   * Parameter:
   * - id (number): ID user yang akan diperbarui.
   * - dto (UpdateUserDto): Data yang akan diperbarui.
   *
   * Return:
   * - object: Data user yang telah diperbarui.
   */
  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(id, dto);
  }

  /**
   * Melakukan soft delete user berdasarkan ID (khusus admin).
   *
   * Parameter:
   * - id (number): ID user yang akan dihapus (soft delete).
   *
   * Return:
   * - object: Hasil soft delete user.
   */
  @Roles('admin')
  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.softDelete(id);
  }

  /**
   * Menghapus user berdasarkan username (khusus admin, untuk testing/dev).
   *
   * Parameter:
   * - body ({ username: string }): Objek berisi username user yang akan dihapus.
   *
   * Return:
   * - object: Hasil penghapusan user.
   */
  @Roles('admin')
  @Delete()
  async deleteByUsername(@Body() body: { username: string }) {
    const user = await this.userService.findByUsername(body.username);
    if (!user) return { message: 'User tidak ditemukan' };
    return this.userService.softDelete(user.id);
  }

  /**
   * Mengunggah dan memperbarui foto profil user yang sedang login.
   *
   * Parameter:
   * - req (Request): Request Express yang berisi data user hasil autentikasi.
   * - file (Express.Multer.File): File foto profil yang diunggah.
   *
   * Return:
   * - object: Data user yang telah diperbarui dengan path foto baru.
   *
   * Catatan:
   * - Hanya menerima file gambar (jpeg, png, jpg, webp) dengan ukuran maksimal 2MB.
   * - Path file disimpan pada field 'foto' user.
   */
  @Patch('profile/foto')
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Menyimpan file ke folder uploads/profile
          cb(null, path.join(__dirname, '..', 'uploads', 'profile'));
        },
        filename: (req, file, cb) => {
          // Penamaan file: userId-timestamp.ext
          const userId = (req.user as any)?.userId;
          const ext = path.extname(file.originalname);
          cb(null, `${userId}-${Date.now()}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Validasi tipe file gambar
        if (!file.mimetype.match(/^image\/(jpeg|png|jpg|webp)$/)) {
          return cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 2 * 1024 * 1024 }, // Maksimal 2MB
    }),
  )
  async uploadFotoProfile(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = (req.user as any)?.userId;
    const fotoPath = `/uploads/profile/${file.filename}`;
    return this.userService.update(userId, { foto: fotoPath });
  }
}
