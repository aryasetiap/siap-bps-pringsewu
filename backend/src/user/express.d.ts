import 'express';

/**
 * File ini berfungsi untuk memperluas interface Request dari Express
 * dengan menambahkan properti user. Properti ini digunakan untuk
 * menyimpan data pengguna yang telah diautentikasi pada aplikasi SIAP,
 * khususnya dalam proses pengelolaan barang, permintaan, dan verifikasi.
 *
 * Ekstensi ini memudahkan akses data pengguna pada setiap request
 * sehingga proses otorisasi dan validasi dapat dilakukan dengan lebih efisien.
 */
declare module 'express' {
  /**
   * Interface Request yang telah diperluas dengan properti user.
   *
   * Properti:
   * - user (any, opsional): Menyimpan data pengguna yang telah login
   *   dan terautentikasi pada sistem SIAP.
   *
   * Contoh penggunaan:
   *   req.user?.id // Mengakses ID pengguna yang sedang login
   */
  interface Request {
    user?: any;
  }
}
