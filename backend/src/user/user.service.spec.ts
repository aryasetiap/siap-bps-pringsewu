import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Mock data user untuk pengujian
const mockUser = {
  id: 1,
  nama: 'Test User',
  username: 'testuser',
  password: 'hashedpass',
  role: 'pegawai',
  status_aktif: true,
};

// DTO mock untuk pembuatan user baru
const createUserDto = {
  nama: 'Test User',
  username: 'testuser',
  password: 'testpass',
  role: 'pegawai',
};

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

  /**
   * Inisialisasi modul testing dan mock repository sebelum setiap pengujian.
   */
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

  /**
   * Memastikan service terdefinisi dengan benar.
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    /**
     * Menguji pembuatan user baru secara sukses.
     * @returns User yang berhasil dibuat.
     */
    it('should create a new user successfully', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);
      (repo.create as jest.Mock).mockReturnValue(mockUser);
      (repo.save as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.create(createUserDto as any);

      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    /**
     * Menguji error jika username sudah terdaftar.
     * @throws BadRequestException jika username sudah ada.
     */
    it('should throw BadRequestException if username already exists', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.create(createUserDto as any)).rejects.toThrow(
        new BadRequestException('Username sudah terdaftar'),
      );
    });
  });

  describe('update', () => {
    /**
     * Menguji update data user secara sukses.
     * @returns User yang sudah diperbarui.
     */
    it('should update user data successfully', async () => {
      const updatedUser = { ...mockUser, nama: 'Updated Name' };
      (repo.findOne as jest.Mock).mockResolvedValue(mockUser);
      (repo.save as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update(1, { nama: 'Updated Name' } as any);

      expect(result.nama).toBe('Updated Name');
      expect(repo.save).toHaveBeenCalled();
    });

    /**
     * Menguji update user tanpa perubahan data.
     * @returns User yang sama tanpa perubahan.
     */
    it('should update user with no changes', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockUser);
      (repo.save as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.update(1, {} as any);
      const { password, ...expected } = mockUser;
      expect(result).toEqual(expected);
    });

    /**
     * Menguji update user dengan perubahan password, memastikan password di-hash.
     * @returns User dengan password baru yang sudah di-hash.
     */
    it('should update user and hash the new password if provided', async () => {
      const updateDtoWithPassword = { password: 'newpass' };
      const userFromDb = { ...mockUser };

      (repo.findOne as jest.Mock).mockResolvedValue(userFromDb);
      (repo.save as jest.Mock).mockImplementation(
        async (userToSave) => userToSave,
      );

      const result = await service.update(1, updateDtoWithPassword as any);

      expect(result.password).toBeUndefined();
      expect(repo.save).toHaveBeenCalledTimes(1);

      const savedUser = (repo.save as jest.Mock).mock.calls[0][0];
      expect(savedUser.password).not.toBe('newpass');

      const isPasswordCorrect = await bcrypt.compare(
        'newpass',
        savedUser.password,
      );
      expect(isPasswordCorrect).toBe(true);
    });

    /**
     * Menguji error jika user yang akan diupdate tidak ditemukan.
     * @throws NotFoundException jika user tidak ada.
     */
    it('should throw NotFoundException if user to update is not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);
      await expect(service.update(999, { nama: 'x' } as any)).rejects.toThrow(
        new NotFoundException('User tidak ditemukan'),
      );
    });

    /**
     * Menguji update status_aktif dengan input string "aktif".
     * @returns User dengan status_aktif true.
     */
    it('should handle status_aktif as string "aktif"', async () => {
      const userFromDb = { ...mockUser, status_aktif: false };
      (repo.findOne as jest.Mock).mockResolvedValue(userFromDb);
      (repo.save as jest.Mock).mockResolvedValue({
        ...userFromDb,
        status_aktif: true,
      });

      const result = await service.update(1, { status_aktif: 'aktif' } as any);
      expect(result.status_aktif).toBe(true);
    });

    /**
     * Menguji update status_aktif dengan input boolean.
     * @returns User dengan status_aktif true.
     */
    it('should handle status_aktif as boolean', async () => {
      const userFromDb = { ...mockUser, status_aktif: false };
      (repo.findOne as jest.Mock).mockResolvedValue(userFromDb);
      (repo.save as jest.Mock).mockResolvedValue({
        ...userFromDb,
        status_aktif: true,
      });

      const result = await service.update(1, { status_aktif: true } as any);
      expect(result.status_aktif).toBe(true);
    });
  });

  describe('softDelete', () => {
    /**
     * Menguji soft delete user dengan mengubah status_aktif menjadi false.
     * @returns User dengan status_aktif false.
     */
    it('should soft delete a user by setting status_aktif to false', async () => {
      const softDeletedUser = { ...mockUser, status_aktif: false };
      (repo.findOne as jest.Mock).mockResolvedValue(mockUser);
      (repo.save as jest.Mock).mockResolvedValue(softDeletedUser);

      const result = await service.softDelete(1);

      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status_aktif: false }),
      );
      expect(result.status_aktif).toBe(false);
    });

    /**
     * Menguji error jika user yang akan dihapus tidak ditemukan.
     * @throws NotFoundException jika user tidak ada.
     */
    it('should throw NotFoundException if user to delete is not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);
      await expect(service.softDelete(999)).rejects.toThrow(
        new NotFoundException('User tidak ditemukan'),
      );
    });
  });

  describe('findAll', () => {
    /**
     * Menguji pengambilan seluruh user.
     * @returns Array user.
     */
    it('should return an array of users', async () => {
      (repo.find as jest.Mock).mockResolvedValue([mockUser]);
      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    /**
     * Menguji pencarian user berdasarkan id.
     * @param id ID user yang dicari.
     * @returns User yang ditemukan.
     */
    it('should find and return a user by id', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockUser);
      const result = await service.findOne(1);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });

    /**
     * Menguji error jika user tidak ditemukan berdasarkan id.
     * @throws NotFoundException jika user tidak ada.
     */
    it('should throw NotFoundException if user is not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);
      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('User tidak ditemukan'),
      );
    });
  });

  describe('findByUsername', () => {
    /**
     * Menguji pencarian user berdasarkan username.
     * @param username Username yang dicari.
     * @returns User yang ditemukan.
     */
    it('should find and return a user by username', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockUser);
      const result = await service.findByUsername('testuser');
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser', status_aktif: true },
      });
      expect(result).toEqual(mockUser);
    });

    /**
     * Menguji hasil null jika user tidak ditemukan berdasarkan username.
     * @returns null jika user tidak ada.
     */
    it('should return null if user is not found by username', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      const result = await service.findByUsername('notfound');
      expect(result).toBeNull();
    });
  });
});
