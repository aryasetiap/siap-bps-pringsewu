import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Data mock untuk user, digunakan di seluruh test
const mockUser = {
  id: 1,
  nama: 'Test User',
  username: 'testuser',
  password: 'hashedpass', // Anggap ini password yang sudah di-hash di DB
  role: 'pegawai',
  status_aktif: true,
};

// DTO (Data Transfer Object) mock untuk membuat user baru
const createUserDto = {
  nama: 'Test User',
  username: 'testuser',
  password: 'testpass',
  role: 'pegawai',
};

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

  beforeEach(async () => {
    // Membuat module testing tiruan (mock)
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          // Menggunakan `useValue` untuk meniru (mock) fungsi-fungsi dari Repository
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

  // Test suite untuk method `create`
  describe('create', () => {
    it('should create a new user successfully', async () => {
      // Arrange: Atur mock untuk skenario sukses
      (repo.findOne as jest.Mock).mockResolvedValue(undefined); // Username belum ada
      (repo.create as jest.Mock).mockReturnValue(mockUser); // `create` mengembalikan entity
      (repo.save as jest.Mock).mockResolvedValue(mockUser); // `save` berhasil

      // Act: Panggil method `create`
      const result = await service.create(createUserDto as any);

      // Assert: Pastikan method yang benar dipanggil dan hasilnya sesuai
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException if username already exists', async () => {
      // Arrange: Atur mock seolah-olah username sudah ada
      (repo.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Act & Assert: Harapkan method `create` melempar error
      await expect(service.create(createUserDto as any)).rejects.toThrow(
        new BadRequestException('Username sudah terdaftar'),
      );
    });
  });

  // Test suite untuk method `update`
  describe('update', () => {
    it('should update user data successfully', async () => {
      // Arrange
      const updatedUser = { ...mockUser, nama: 'Updated Name' };
      (repo.findOne as jest.Mock).mockResolvedValue(mockUser);
      (repo.save as jest.Mock).mockResolvedValue(updatedUser);

      // Act
      const result = await service.update(1, { nama: 'Updated Name' } as any);

      // Assert
      expect(result.nama).toBe('Updated Name');
      expect(repo.save).toHaveBeenCalled();
    });

    it('should update user with no changes', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockUser);
      (repo.save as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.update(1, {} as any);
      const { password, ...expected } = mockUser;
      expect(result).toEqual(expected);
    });

    // =======================================================================
    // INI ADALAH TEST YANG GAGAL - PENJELASAN LENGKAP DI BAWAH
    // =======================================================================
    it('should update user and hash the new password if provided', async () => {
      // Arrange: Siapkan data dan mock
      const updateDtoWithPassword = { password: 'newpass' };
      const userFromDb = { ...mockUser }; // Buat salinan user dari "DB"

      // Atur mock: saat `findOne` dipanggil, kembalikan user yang ada
      (repo.findOne as jest.Mock).mockResolvedValue(userFromDb);

      // Atur mock: saat `save` dipanggil, kita ingin menangkap argumen yang dikirim
      // dan meniru perilaku DB yang akan mengembalikan entity yang disimpan.
      (repo.save as jest.Mock).mockImplementation(async (userToSave) => {
        return userToSave;
      });

      // Act: Panggil method `update` yang sedang diuji
      const result = await service.update(1, updateDtoWithPassword as any);

      // Assert: Periksa apakah hasilnya sesuai harapan

      // 1. Service tidak boleh mengembalikan password ke client setelah update.
      expect(result.password).toBeUndefined();

      // 2. Method `save` harusnya dipanggil tepat satu kali.
      expect(repo.save).toHaveBeenCalledTimes(1);

      // 3. Ambil objek `user` yang dikirim oleh service ke method `repo.save`.
      const savedUser = (repo.save as jest.Mock).mock.calls[0][0];

      // 4. [PENYEBAB ERROR] Password pada objek yang akan disimpan TIDAK BOLEH
      //    sama dengan password teks biasa ('newpass'). Seharusnya sudah di-hash.
      //    Jika test ini gagal, artinya `UserService.update` Anda mengirim
      //    password tanpa di-hash ke `repo.save`.
      expect(savedUser.password).not.toBe('newpass');

      // 5. Untuk memastikan, kita bandingkan password asli ('newpass') dengan
      //    password yang sudah di-hash (`savedUser.password`) menggunakan `bcrypt`.
      //    Hasilnya harus `true`.
      const isPasswordCorrect = await bcrypt.compare(
        'newpass',
        savedUser.password,
      );
      expect(isPasswordCorrect).toBe(true);
    });

    it('should throw NotFoundException if user to update is not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);
      await expect(service.update(999, { nama: 'x' } as any)).rejects.toThrow(
        new NotFoundException('User tidak ditemukan'),
      );
    });

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

  // Test suite untuk method `softDelete`
  describe('softDelete', () => {
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

    it('should throw NotFoundException if user to delete is not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);
      await expect(service.softDelete(999)).rejects.toThrow(
        new NotFoundException('User tidak ditemukan'),
      );
    });
  });

  // Test suite untuk method `findAll`
  describe('findAll', () => {
    it('should return an array of users', async () => {
      (repo.find as jest.Mock).mockResolvedValue([mockUser]);
      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  // Test suite untuk method `findOne`
  describe('findOne', () => {
    it('should find and return a user by id', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockUser);
      const result = await service.findOne(1);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);
      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('User tidak ditemukan'),
      );
    });
  });

  // Test suite untuk method `findByUsername`
  describe('findByUsername', () => {
    it('should find and return a user by username', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(mockUser);
      const result = await service.findByUsername('testuser');
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser', status_aktif: true },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found by username', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      const result = await service.findByUsername('notfound');
      expect(result).toBeNull();
    });
  });
});
