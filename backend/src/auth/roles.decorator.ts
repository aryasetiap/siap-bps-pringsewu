// filepath: d:\1. SANDBOX\Project\Project 2025\siap-bps-pringsewu\backend\src\auth\roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
