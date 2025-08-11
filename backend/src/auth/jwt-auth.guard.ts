/**
 * File ini berisi guard otentikasi JWT untuk aplikasi SIAP BPS Pringsewu.
 * Guard ini digunakan untuk melindungi endpoint terkait pengelolaan barang, permintaan, dan verifikasi
 * agar hanya pengguna yang telah terverifikasi yang dapat mengaksesnya.
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard
 *
 * Guard ini digunakan untuk memvalidasi token JWT pada setiap permintaan ke endpoint yang dilindungi.
 * Guard akan memastikan bahwa hanya pengguna yang memiliki token JWT valid yang dapat mengakses resource aplikasi SIAP.
 *
 * Parameter:
 * - Tidak ada parameter khusus, guard ini digunakan sebagai decorator pada controller atau route.
 *
 * Return:
 * - Jika token valid: permintaan diteruskan ke handler berikutnya.
 * - Jika token tidak valid: permintaan ditolak dengan respon unauthorized (401).
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
