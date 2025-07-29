import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard otentikasi JWT untuk melindungi route.
 *
 * Guard ini akan memeriksa validitas token JWT pada setiap permintaan.
 * Jika token valid, permintaan akan diteruskan ke handler berikutnya.
 * Jika tidak, permintaan akan ditolak dengan respon unauthorized.
 *
 * Digunakan dengan menambahkan guard ini pada controller atau route yang ingin dilindungi.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
