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

@Controller('user')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Mengambil data khusus untuk admin.
   * @returns Objek berisi pesan untuk admin.
   */
  @Roles('admin')
  @Get('admin-only')
  getAdminData() {
    return { message: 'Data khusus admin' };
  }

  /**
   * Mengambil data khusus untuk pegawai.
   * @returns Objek berisi pesan untuk pegawai.
   */
  @Roles('pegawai')
  @Get('pegawai-only')
  getPegawaiData() {
    return { message: 'Data khusus pegawai' };
  }

  /**
   * Mengambil profil user yang sedang login.
   * @param req Request dari Express yang berisi user.
   * @returns Data user yang sedang login.
   */
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const userId = (req.user as any)?.userId;
    return this.userService.findOne(userId);
  }

  /**
   * Memperbarui profil user yang sedang login.
   * @param req Request dari Express yang berisi user.
   * @param dto Data untuk memperbarui user.
   * @returns Data user yang telah diperbarui.
   */
  @Patch('profile')
  async updateProfile(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const userId = (req.user as any)?.userId;
    return this.userService.update(userId, dto);
  }

  /**
   * Membuat user baru (khusus admin).
   * @param dto Data user baru.
   * @returns Data user yang telah dibuat.
   */
  @Roles('admin')
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  /**
   * Mengambil seluruh data user (khusus admin).
   * @returns Daftar seluruh user.
   */
  @Roles('admin')
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  /**
   * Mengambil data user berdasarkan ID (khusus admin).
   * @param id ID user.
   * @returns Data user yang ditemukan.
   */
  @Roles('admin')
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  /**
   * Memperbarui data user berdasarkan ID (khusus admin).
   * @param id ID user.
   * @param dto Data yang akan diperbarui.
   * @returns Data user yang telah diperbarui.
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
   * @param id ID user.
   * @returns Hasil soft delete user.
   */
  @Roles('admin')
  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.softDelete(id);
  }

  /**
   * Menghapus user berdasarkan username (khusus admin, untuk testing/dev).
   * @param body Objek berisi username user yang akan dihapus.
   * @returns Hasil penghapusan user.
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
   * @param req Request dari Express yang berisi user.
   * @param file File foto profil yang diunggah.
   * @returns Data user yang telah diperbarui dengan path foto baru.
   */
  @Patch('profile/foto')
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, path.join(__dirname, '..', 'uploads', 'profile'));
        },
        filename: (req, file, cb) => {
          const userId = (req.user as any)?.userId;
          const ext = path.extname(file.originalname);
          cb(null, `${userId}-${Date.now()}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|jpg|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 2 * 1024 * 1024 },
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
