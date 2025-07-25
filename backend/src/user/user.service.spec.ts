import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

const mockUser = {
  id: 1,
  nama: 'Test User',
  username: 'testuser',
  password: 'hashedpass',
  role: 'pegawai',
  status_aktif: true,
};

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(undefined);
    (repo.create as jest.Mock).mockReturnValue(mockUser);
    (repo.save as jest.Mock).mockResolvedValue(mockUser);

    const dto = {
      nama: 'Test User',
      username: 'testuser',
      password: 'testpass',
      role: 'pegawai',
    };
    const result = await service.create(dto as any);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  it('should throw BadRequestException if username already exists on create', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(mockUser);
    const dto = {
      nama: 'Test User',
      username: 'testuser',
      password: 'testpass',
      role: 'pegawai',
    };
    await expect(service.create(dto as any)).rejects.toThrow(
      'Username sudah terdaftar',
    );
  });

  it('should update user', async () => {
    const updated = { ...mockUser, nama: 'Updated Name' };
    (repo.findOne as jest.Mock).mockResolvedValue(mockUser);
    (repo.save as jest.Mock).mockResolvedValue(updated);

    const dto = { nama: 'Updated Name' };
    const result = await service.update(1, dto as any);
    expect(result.nama).toBe('Updated Name');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should update user and hash password if password is provided', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(mockUser);
    const hashed = await bcrypt.hash('newpass', 10);
    (repo.save as jest.Mock).mockImplementation(async (user) => user);

    const dto = { password: 'newpass' };
    const result = await service.update(1, dto as any);
    expect(result.password).not.toBe('newpass');
    expect(await bcrypt.compare('newpass', result.password)).toBe(true);
    expect(repo.save).toHaveBeenCalled();
  });

  it('should soft delete user', async () => {
    const softDeleted = { ...mockUser, status_aktif: false };
    (repo.findOne as jest.Mock).mockResolvedValue(mockUser);
    (repo.save as jest.Mock).mockResolvedValue(softDeleted);

    const result = await service.softDelete(1);
    expect(result.status_aktif).toBe(false);
  });

  it('should find user by username', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(mockUser);
    const result = await service.findByUsername('testuser');
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { username: 'testuser', status_aktif: true },
    });
    expect(result).toEqual(mockUser);
  });

  it('should return null if user not found by username', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(null);
    const result = await service.findByUsername('notfound');
    expect(result).toBeNull();
  });

  it('should find all users', async () => {
    (repo.find as jest.Mock).mockResolvedValue([mockUser]);
    const result = await service.findAll();
    expect(repo.find).toHaveBeenCalled();
    expect(result).toEqual([mockUser]);
  });

  it('should find one user by id', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(mockUser);
    const result = await service.findOne(1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException if user not found in findOne', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(undefined);
    await expect(service.findOne(999)).rejects.toThrow('User tidak ditemukan');
  });

  it('should throw NotFoundException if user not found on update', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(undefined);
    await expect(service.update(999, { nama: 'x' } as any)).rejects.toThrow(
      'User tidak ditemukan',
    );
  });

  it('should throw NotFoundException if user not found on softDelete', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(undefined);
    await expect(service.softDelete(999)).rejects.toThrow(
      'User tidak ditemukan',
    );
  });
});
