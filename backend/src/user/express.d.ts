import 'express';

/**
 * Ekstensi interface Request dari Express untuk menambahkan properti user.
 *
 * Properti:
 * - user (opsional): Menyimpan data pengguna yang telah diautentikasi.
 */
declare module 'express' {
  interface Request {
    user?: any;
  }
}
