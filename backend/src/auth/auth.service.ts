import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

/**
 * Service untuk menangani autentikasi pengguna.
 */
@Injectable()
export class AuthService {
  private tokenBlacklist: Set<string> = new Set();

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Memvalidasi kredensial pengguna berdasarkan username dan password.
   *
   * @param username - Nama pengguna yang akan divalidasi.
   * @param password - Password yang akan divalidasi.
   * @returns Objek user tanpa password jika valid, atau null jika tidak valid.
   */
  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Melakukan proses login pengguna dan menghasilkan token JWT jika berhasil.
   *
   * @param username - Nama pengguna yang akan login.
   * @param password - Password pengguna.
   * @returns Objek berisi access_token dan data user jika login berhasil.
   * @throws UnauthorizedException jika user tidak ditemukan atau password salah.
   */
  async login(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new UnauthorizedException('User not found');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid password');
    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        nama: user.nama,
      },
    };
  }

  /**
   * Melakukan proses logout dengan menambahkan token ke blacklist.
   *
   * @param token - Token JWT yang akan di-blacklist.
   * @returns Pesan konfirmasi logout berhasil.
   */
  logout(token: string) {
    this.tokenBlacklist.add(token);
    return { message: 'Logout success (token revoked)' };
  }

  /**
   * Mengecek apakah token sudah masuk ke dalam blacklist.
   *
   * @param token - Token JWT yang akan dicek.
   * @returns True jika token ada di blacklist, false jika tidak.
   */
  isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }
}
