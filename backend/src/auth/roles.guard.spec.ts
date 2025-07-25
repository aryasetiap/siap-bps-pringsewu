import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() } as any;
    guard = new RolesGuard(reflector);
  });

  it('should allow if no roles required', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);
    const context = {
      switchToHttp: () => ({ getRequest: () => ({ user: { role: 'admin' } }) }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow if user has required role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);
    const context = {
      switchToHttp: () => ({ getRequest: () => ({ user: { role: 'admin' } }) }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny if user does not have required role', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'pegawai' } }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
    expect(guard.canActivate(context)).toBe(false);
  });
});
