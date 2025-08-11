/**
 * roles.guard.ts
 *
 * Guard ini digunakan untuk memeriksa apakah pengguna memiliki peran (role) yang diperlukan
 * untuk mengakses endpoint tertentu pada aplikasi SIAP (Sistem Informasi Administrasi Pengelolaan Barang).
 * Guard ini sangat penting untuk memastikan hanya pengguna dengan hak akses yang sesuai
 * dapat melakukan permintaan atau verifikasi data barang.
 */

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * RolesGuard
 *
 * Guard untuk memvalidasi peran pengguna sebelum mengakses route yang membutuhkan otorisasi khusus.
 * Guard ini mengambil metadata 'roles' dari handler atau class dan membandingkannya dengan role pengguna.
 *
 * Parameter:
 * - reflector (Reflector): Dependency injection untuk mengambil metadata dari route handler/class.
 *
 * Fungsi Utama:
 * - canActivate: Memeriksa apakah pengguna memiliki role yang sesuai dengan persyaratan endpoint.
 *
 * Return:
 * - boolean: True jika pengguna memiliki role yang sesuai atau tidak ada role yang disyaratkan, False jika tidak memenuhi syarat.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /**
   * canActivate
   *
   * Fungsi ini digunakan untuk menentukan apakah request saat ini diizinkan berdasarkan role pengguna.
   *
   * Parameter:
   * - context (ExecutionContext): Informasi eksekusi request saat ini, termasuk handler dan class.
   *
   * Return:
   * - boolean: True jika pengguna memiliki role yang sesuai, False jika tidak.
   */
  canActivate(context: ExecutionContext): boolean {
    // Mengambil daftar role yang dibutuhkan dari metadata route
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Jika tidak ada role yang disyaratkan, izinkan akses
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Mengambil data user dari request HTTP
    const request = context.switchToHttp().getRequest();
    const userRole = request.user?.role;

    // Memeriksa apakah role user termasuk dalam daftar role yang dibutuhkan
    return requiredRoles.includes(userRole);
  }
}
