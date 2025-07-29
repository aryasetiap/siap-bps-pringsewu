import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Guard untuk memeriksa apakah pengguna memiliki peran (role) yang diperlukan
 * untuk mengakses route tertentu.
 *
 * @param context - ExecutionContext yang berisi informasi tentang request saat ini.
 * @returns boolean - Mengembalikan true jika pengguna memiliki role yang sesuai atau
 * jika tidak ada role yang disyaratkan; false jika tidak memenuhi syarat.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user?.role);
  }
}
