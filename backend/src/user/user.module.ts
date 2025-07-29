import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

/**
 * Modul User
 *
 * Modul ini bertanggung jawab untuk mengelola fitur-fitur terkait user,
 * termasuk service dan controller yang berhubungan dengan entitas User.
 *
 * Impor:
 * - TypeOrmModule: Untuk menghubungkan entitas User dengan database.
 * - UserService: Menyediakan logika bisnis terkait user.
 * - UserController: Menangani permintaan HTTP terkait user.
 *
 * Ekspor:
 * - UserService: Agar dapat digunakan di modul lain.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
