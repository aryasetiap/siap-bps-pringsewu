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
});
