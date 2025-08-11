/**
 * File ini berisi pengujian unit untuk UserService pada aplikasi SIAP.
 * UserService bertanggung jawab atas pengelolaan data user, termasuk pembuatan, pembaruan, penghapusan, dan pencarian user.
 * Pengujian dilakukan menggunakan Jest dan mock repository TypeORM.
 *
 * Konteks bisnis: User digunakan untuk mengelola akses aplikasi SIAP, termasuk pengelolaan barang, permintaan, dan verifikasi.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Data mock user untuk pengujian
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

  describe('update', () => {
    /**
     * Fungsi ini menguji update data user pada aplikasi SIAP.
     *
     * Parameter:
     * - id (number): ID user yang akan diupdate.
     * - updateDto (object): Data yang akan diperbarui.
     *
     * Return:
     * - User: User yang sudah diperbarui.
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
     * Fungsi ini menguji update user tanpa perubahan data.
     *
     * Parameter:
     * - id (number): ID user yang akan diupdate.
     * - updateDto (object): Data kosong.
     *
     * Return:
     * - User: User yang sama tanpa perubahan.
     */
    it('should update user with no changes', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockUser);
      (repo.save as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.update(1, {} as any);
      const { password, ...expected } = mockUser;
      expect(result).toEqual(expected);
    });

    /**
     * Fungsi ini menguji update user dengan perubahan password, memastikan password di-hash.
     *
     * Parameter:
     * - id (number): ID user yang akan diupdate.
     * - updateDto (object): Data dengan password baru.
     *
     * Return:
     * - User: User dengan password baru yang sudah di-hash.
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

      // Pastikan password yang disimpan sudah di-hash
      const savedUser = (repo.save as jest.Mock).mock.calls[0][0];
      expect(savedUser.password).not.toBe('newpass');

      const isPasswordCorrect = await bcrypt.compare(
        'newpass',
        savedUser.password,
      );
      expect(isPasswordCorrect).toBe(true);
    });

    /**
     * Fungsi ini menguji error jika user yang akan diupdate tidak ditemukan.
     *
     * Parameter:
     * - id (number): ID user yang akan diupdate.
     * - updateDto (object): Data yang akan diperbarui.
     *
     * Return:
     * - Error: NotFoundException jika user tidak ada.
     */
    it('should throw NotFoundException if user to update is not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);
      await expect(service.update(999, { nama: 'x' } as any)).rejects.toThrow(
        new NotFoundException('User tidak ditemukan'),
      );
    });

    /**
     * Fungsi ini menguji update status_aktif dengan input string "aktif".
     *
     * Parameter:
     * - id (number): ID user yang akan diupdate.
     * - updateDto (object): Data dengan status_aktif "aktif".
     *
     * Return:
     * - User: User dengan status_aktif true.
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
     * Fungsi ini menguji update status_aktif dengan input boolean.
     *
     * Parameter:
     * - id (number): ID user yang akan diupdate.
     * - updateDto (object): Data dengan status_aktif boolean.
     *
     * Return:
     * - User: User dengan status_aktif true.
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

    it('should update multiple fields', async () => {
      const updatedUser = { ...mockUser, nama: 'Updated', unit_kerja: 'IT' };
      (repo.findOne as jest.Mock).mockResolvedValue(mockUser);
      (repo.save as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update(1, { nama: 'Updated', unit_kerja: 'IT' } as any);
      expect(result.nama).toBe('Updated');
      expect(result.unit_kerja).toBe('IT');
    });

    it('should update foto field', async () => {
      const updatedUser = { ...mockUser, foto: '/uploads/profile/1.jpg' };
      (repo.findOne as jest.Mock).mockResolvedValue(mockUser);
      (repo.save as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update(1, { foto: '/uploads/profile/1.jpg' } as any);
      expect(result.foto).toBe('/uploads/profile/1.jpg');
    });
  });

  describe('create', () => {
    /**
     * Fungsi ini menguji pembuatan user baru pada aplikasi SIAP.
     *
     * Parameter:
     * - createUserDto (object): Data user yang akan dibuat.
     *
     * Return:
     * - User: User yang berhasil dibuat.
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
     * Fungsi ini menguji error jika username sudah terdaftar.
     *
     * Parameter:
     * - createUserDto (object): Data user yang akan dibuat.
     *
     * Return:
     * - Error: BadRequestException jika username sudah ada.
     */
    it('should throw BadRequestException if username already exists', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.create(createUserDto as any)).rejects.toThrow(
        new BadRequestException('Username sudah terdaftar'),
      );
    });

    it('should create user with optional fields', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);
      (repo.create as jest.Mock).mockReturnValue({ ...mockUser, unit_kerja: 'IT', foto: 'foto.jpg' });
      (repo.save as jest.Mock).mockResolvedValue({ ...mockUser, unit_kerja: 'IT', foto: 'foto.jpg' });

      const dto = { ...createUserDto, unit_kerja: 'IT', foto: 'foto.jpg' };
      const result = await service.create(dto as any);
      expect(result.unit_kerja).toBe('IT');
      expect(result.foto).toBe('foto.jpg');
    });
  });

  describe('softDelete', () => {
    /**
     * Fungsi ini menguji soft delete user dengan mengubah status_aktif menjadi false.
     *
     * Parameter:
     * - id (number): ID user yang akan dihapus.
     *
     * Return:
     * - User: User dengan status_aktif false.
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
     * Fungsi ini menguji error jika user yang akan dihapus tidak ditemukan.
     *
     * Parameter:
     * - id (number): ID user yang akan dihapus.
     *
     * Return:
     * - Error: NotFoundException jika user tidak ada.
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
     * Fungsi ini menguji pengambilan seluruh user aktif pada aplikasi SIAP.
     *
     * Return:
     * - User[]: Array user.
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
     * Fungsi ini menguji pencarian user berdasarkan id.
     *
     * Parameter:
     * - id (number): ID user yang dicari.
     *
     * Return:
     * - User: User yang ditemukan.
     */
    it('should find and return a user by id', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockUser);
      const result = await service.findOne(1);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });

    /**
     * Fungsi ini menguji error jika user tidak ditemukan berdasarkan id.
     *
     * Parameter:
     * - id (number): ID user yang dicari.
     *
     * Return:
     * - Error: NotFoundException jika user tidak ada.
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
     * Fungsi ini menguji pencarian user berdasarkan username.
     *
     * Parameter:
     * - username (string): Username yang dicari.
     *
     * Return:
     * - User | null: User yang ditemukan atau null jika tidak ada.
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
     * Fungsi ini menguji hasil null jika user tidak ditemukan berdasarkan username.
     *
     * Parameter:
     * - username (string): Username yang dicari.
     *
     * Return:
     * - null: Jika user tidak ada.
     */
    it('should return null if user is not found by username', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      const result = await service.findByUsername('notfound');
      expect(result).toBeNull();
    });
  });
});
