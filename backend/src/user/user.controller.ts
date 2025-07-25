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
@Roles('admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Endpoint khusus admin
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
    // req.user di-set oleh JWT AuthGuard
    const userId = (req.user as any)?.userId;
    return this.userService.findOne(userId);
  }

  @Patch('profile')
  async updateProfile(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const userId = (req.user as any)?.userId;
    return this.userService.update(userId, dto);
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.softDelete(id);
  }
}
