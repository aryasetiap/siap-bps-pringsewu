/**
 * File: user.module.ts
 * Modul ini digunakan untuk mengelola fitur terkait user pada aplikasi SIAP,
 * seperti pengelolaan data user, permintaan akses, dan verifikasi user.
 *
 * Modul ini menghubungkan entitas User dengan database menggunakan TypeORM,
 * serta menyediakan service dan controller untuk kebutuhan bisnis user.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

/**
 * Kelas UserModule
 *
 * Modul utama untuk pengelolaan user pada aplikasi SIAP.
 *
 * Parameter:
 * - imports: Modul-modul yang diperlukan, seperti TypeOrmModule untuk entitas User.
 * - providers: Service yang berisi logika bisnis terkait user.
 * - controllers: Controller yang menangani permintaan HTTP terkait user.
 * - exports: Service yang dapat digunakan di modul lain.
 *
 * Return:
 * - UserModule: Modul yang siap digunakan oleh aplikasi utama.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Menghubungkan entitas User ke database
  ],
  providers: [
    UserService, // Menyediakan logika bisnis user (registrasi, verifikasi, dsb)
  ],
  controllers: [
    UserController, // Menangani permintaan HTTP terkait user (CRUD, verifikasi, dsb)
  ],
  exports: [
    UserService, // Mengekspor UserService agar dapat digunakan di modul lain
  ],
})
export class UserModule {}
