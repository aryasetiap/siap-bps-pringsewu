// filepath: d:\1. SANDBOX\Project\Project 2025\siap-bps-pringsewu\backend\src\auth\roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
/**
 * Dekorator untuk menetapkan peran (roles) yang diperlukan pada route handler.
 *
 * @param roles Daftar nama peran (roles) yang diizinkan mengakses route.
 * @returns Fungsi dekorator yang menambahkan metadata 'roles' pada route handler.
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
