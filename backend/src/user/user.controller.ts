import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('user')
export class UserController {
  // Endpoint khusus admin
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('admin-only')
  getAdminData() {
    return { message: 'Data khusus admin' };
  }

  // Endpoint khusus pegawai
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('pegawai')
  @Get('pegawai-only')
  getPegawaiData() {
    return { message: 'Data khusus pegawai' };
  }

  // Endpoint bisa diakses semua user yang sudah login (tanpa role spesifik)
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile() {
    return { message: 'Profil user (login saja)' };
  }
}
