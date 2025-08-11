// filepath: d:\1. SANDBOX\Project\Project 2025\siap-bps-pringsewu\backend\src\auth\roles.decorator.ts

import { SetMetadata } from '@nestjs/common';

/**
 * Dekorator Roles digunakan untuk menetapkan metadata peran (roles) yang diperlukan
 * pada route handler dalam aplikasi SIAP. Metadata ini akan digunakan oleh guard
 * untuk memverifikasi apakah pengguna memiliki hak akses yang sesuai, misalnya
 * dalam pengelolaan barang, permintaan, atau proses verifikasi.
 *
 * Parameter:
 * - roles (string[]): Daftar nama peran yang diizinkan mengakses route tertentu.
 *
 * Return:
 * - MethodDecorator: Fungsi dekorator yang menambahkan metadata 'roles' pada route handler.
 *
 * Contoh penggunaan:
 * @Roles('admin', 'verifikator')
 * async someHandler() { ... }
 */
export const Roles = (...roles: string[]): MethodDecorator =>
  SetMetadata('roles', roles);
