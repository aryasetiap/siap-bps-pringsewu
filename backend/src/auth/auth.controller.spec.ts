import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  login: jest.fn(),
  logout: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  /**
   * Membuat instance AuthController untuk setiap pengujian.
   *
   * Tujuan: Menyiapkan modul pengujian dengan controller dan service yang sudah dimock.
   * Tidak menerima parameter.
   * Tidak mengembalikan nilai.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  /**
   * Menguji apakah controller berhasil didefinisikan.
   *
   * Tujuan: Memastikan instance controller berhasil dibuat.
   * Tidak menerima parameter.
   * Tidak mengembalikan nilai.
   */
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /**
   * Menguji fungsi login pada controller.
   *
   * Tujuan: Memastikan fungsi login memanggil AuthService.login dengan parameter yang benar dan mengembalikan token.
   * Tidak menerima parameter.
   * Tidak mengembalikan nilai.
   */
  it('should call login', async () => {
    mockAuthService.login.mockResolvedValue({ access_token: 'token' });
    const req = { body: { username: 'admin', password: 'admin123' } };
    const result = await controller.login(req);
    expect(result.access_token).toBe('token');
    expect(mockAuthService.login).toHaveBeenCalledWith('admin', 'admin123');
  });

  /**
   * Menguji fungsi logout pada controller dengan token yang valid.
   *
   * Tujuan: Memastikan fungsi logout memanggil AuthService.logout dengan token yang benar dan mengembalikan pesan sukses.
   * Tidak menerima parameter.
   * Tidak mengembalikan nilai.
   */
  it('should call logout', async () => {
    mockAuthService.logout.mockResolvedValue({
      message: 'Logout success (token revoked)',
    });
    const result = await controller.logout('Bearer sometoken');
    expect(result.message).toMatch(/Logout success/);
    expect(mockAuthService.logout).toHaveBeenCalledWith('sometoken');
  });

  /**
   * Menguji fungsi logout pada controller tanpa token.
   *
   * Tujuan: Memastikan fungsi logout mengembalikan pesan jika token tidak diberikan.
   * Tidak menerima parameter.
   * Tidak mengembalikan nilai.
   */
  it('should return message if no token on logout', async () => {
    const result = await controller.logout('');
    expect(result.message).toBe('No token provided');
  });
});
