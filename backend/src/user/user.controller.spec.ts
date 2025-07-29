import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const mockUser = {
  id: 1,
  nama: 'Test User',
  username: 'testuser',
  password: 'hashedpass',
  role: 'pegawai',
  status_aktif: true,
};

const mockUserService = {
  create: jest.fn().mockResolvedValue(mockUser),
  findAll: jest.fn().mockResolvedValue([mockUser]),
  findOne: jest.fn().mockResolvedValue(mockUser),
  update: jest.fn().mockResolvedValue({ ...mockUser, nama: 'Updated' }),
  softDelete: jest.fn().mockResolvedValue({ ...mockUser, status_aktif: false }),
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user', async () => {
    const dto = {
      nama: 'Test User',
      username: 'testuser',
      password: 'pass',
      role: 'pegawai',
    };
    expect(await controller.create(dto as any)).toEqual(mockUser);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all users', async () => {
    expect(await controller.findAll()).toEqual([mockUser]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return one user', async () => {
    expect(await controller.findOne(1)).toEqual(mockUser);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update user', async () => {
    const dto = { nama: 'Updated' };
    expect(await controller.update(1, dto as any)).toEqual({
      ...mockUser,
      nama: 'Updated',
    });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should soft delete user', async () => {
    expect(await controller.softDelete(1)).toEqual({
      ...mockUser,
      status_aktif: false,
    });
    expect(service.softDelete).toHaveBeenCalledWith(1);
  });

  it('should get profile', async () => {
    const req = { user: { userId: 1 } } as any;
    await controller.getProfile(req);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update profile', async () => {
    const req = { user: { userId: 1 } } as any;
    const dto = { nama: 'Updated Profile' };
    await controller.updateProfile(req, dto as any);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should call service.update for uploadFotoProfile', async () => {
    const req = { user: { userId: 1 } } as any;
    const file = { filename: '1-123.jpg' } as any;
    const service = { update: jest.fn() };
    const controller = new UserController(service as any);
    await controller.uploadFotoProfile(req, file);
    expect(service.update).toHaveBeenCalledWith(1, {
      foto: '/uploads/profile/1-123.jpg',
    });
  });

  it('should return admin-only data', async () => {
    expect(await controller.getAdminData()).toEqual({
      message: 'Data khusus admin',
    });
  });

  it('should return pegawai-only data', async () => {
    expect(await controller.getPegawaiData()).toEqual({
      message: 'Data khusus pegawai',
    });
  });

  it('should handle updateProfile error if user not found', async () => {
    const req = { user: { userId: 999 } } as any;
    const dto = { nama: 'X' };
    service.update = jest
      .fn()
      .mockRejectedValue(new Error('User tidak ditemukan'));
    await expect(controller.updateProfile(req, dto as any)).rejects.toThrow(
      'User tidak ditemukan',
    );
  });

  it('should handle uploadFotoProfile error if user not found', async () => {
    const req = { user: { userId: 999 } } as any;
    const file = { filename: 'notfound.jpg' } as any;
    const service = {
      update: jest.fn().mockRejectedValue(new Error('User tidak ditemukan')),
    };
    const controller = new UserController(service as any);
    await expect(controller.uploadFotoProfile(req, file)).rejects.toThrow(
      'User tidak ditemukan',
    );
  });

  it('should handle error on create', async () => {
    service.create = jest.fn().mockRejectedValue(new Error('Create error'));
    await expect(controller.create({} as any)).rejects.toThrow('Create error');
  });

  it('should handle error on update', async () => {
    service.update = jest.fn().mockRejectedValue(new Error('Update error'));
    await expect(controller.update(1, {} as any)).rejects.toThrow(
      'Update error',
    );
  });

  it('should handle error on softDelete', async () => {
    service.softDelete = jest.fn().mockRejectedValue(new Error('Delete error'));
    await expect(controller.softDelete(1)).rejects.toThrow('Delete error');
  });
});
