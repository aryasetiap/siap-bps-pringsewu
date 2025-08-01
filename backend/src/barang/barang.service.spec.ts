import { Test, TestingModule } from '@nestjs/testing';
import { BarangService } from './barang.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Barang } from '../entities/barang.entity';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateBarangDto } from './dto/create-barang.dto';

const mockBarang = {
  id: 1,
  kode_barang: 'BRG001',
  nama_barang: 'Kertas A4',
  satuan: 'rim',
  stok: 100,
  ambang_batas_kritis: 10,
  status_aktif: true,
};

describe('BarangService', () => {
  let service: BarangService;
  let repo: Repository<Barang>;

  /**
   * Inisialisasi modul testing dan mock repository sebelum setiap pengujian.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BarangService,
        {
          provide: getRepositoryToken(Barang),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(),
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BarangService>(BarangService);
    repo = module.get<Repository<Barang>>(getRepositoryToken(Barang));
  });

  /**
   * Menguji validasi update stok negatif.
   * @returns Error jika stok bernilai negatif.
   */
  it('should throw BadRequestException if update called with negative stok', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(mockBarang);
    await expect(service.update(1, { stok: -1 } as any)).rejects.toThrow(
      'Stok tidak boleh negatif',
    );
  });

  /**
   * Menguji penambahan stok dengan jumlah 0 tidak mengubah stok.
   * @returns Barang dengan stok tetap.
   */
  it('should not change stok if addStok called with jumlah 0', async () => {
    const barang = { ...mockBarang, stok: 10, status_aktif: true };
    (repo.findOne as jest.Mock).mockResolvedValue(barang);
    (repo.save as jest.Mock).mockResolvedValue({ ...barang, stok: 10 });
    const result = await service.addStok(1, { jumlah: 0 });
    expect(result.stok).toBe(10);
  });

  /**
   * Menguji pengambilan semua barang tanpa query filter.
   * @returns Daftar seluruh barang.
   */
  it('should return all barang if no query is provided', async () => {
    const qb = {
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockBarang]),
    };
    (repo.createQueryBuilder as jest.Mock).mockReturnValue(qb);
    const result = await service.findAll();
    expect(result).toEqual([mockBarang]);
  });

  /**
   * Memastikan service terdefinisi.
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * Menguji pembuatan barang baru.
   * @returns Barang yang berhasil dibuat.
   */
  it('should create barang', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(undefined);
    (repo.create as jest.Mock).mockReturnValue(mockBarang);
    (repo.save as jest.Mock).mockResolvedValue(mockBarang);

    const dto = {
      kode_barang: 'BRG001',
      nama_barang: 'Kertas A4',
      satuan: 'rim',
    };
    const result = await service.create(dto as any);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalledWith(mockBarang);
    expect(result).toEqual(mockBarang);
  });

  /**
   * Menguji validasi kode_barang yang sudah terdaftar.
   * @returns Error jika kode_barang sudah ada.
   */
  it('should throw BadRequestException if kode_barang exists', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(mockBarang);
    const dto = { kode_barang: 'BRG001', nama_barang: 'X', satuan: 'rim' };
    await expect(service.create(dto as any)).rejects.toThrow(
      'Kode barang sudah terdaftar',
    );
  });

  /**
   * Menguji update data barang.
   * @returns Barang yang sudah diperbarui.
   */
  it('should update barang', async () => {
    const updated = { ...mockBarang, nama_barang: 'Updated' };
    (repo.findOne as jest.Mock).mockResolvedValue(mockBarang);
    (repo.save as jest.Mock).mockResolvedValue(updated);

    const dto = { nama_barang: 'Updated' };
    const result = await service.update(1, dto as any);
    expect(result.nama_barang).toBe('Updated');
    expect(repo.save).toHaveBeenCalled();
  });

  /**
   * Menguji error jika barang yang akan diupdate tidak ditemukan.
   * @returns Error NotFoundException.
   */
  it('should throw NotFoundException if barang to update not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(undefined);
    await expect(
      service.update(999, { nama_barang: 'X' } as any),
    ).rejects.toThrow('Barang tidak ditemukan');
  });

  /**
   * Menguji validasi stok negatif saat update.
   * @returns Error jika stok negatif.
   */
  it('should throw error if update called with invalid stok', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(mockBarang);
    await expect(service.update(1, { stok: -10 } as any)).rejects.toThrow();
  });

  /**
   * Menguji soft delete barang.
   * @returns Barang dengan status_aktif false.
   */
  it('should soft delete barang', async () => {
    const softDeleted = { ...mockBarang, status_aktif: false };
    (repo.findOne as jest.Mock).mockResolvedValue(mockBarang);
    (repo.save as jest.Mock).mockResolvedValue(softDeleted);

    const result = await service.softDelete(1);
    expect(result.status_aktif).toBe(false);
  });

  /**
   * Menguji error jika barang yang akan dihapus tidak ditemukan.
   * @returns Error NotFoundException.
   */
  it('should throw NotFoundException if barang to delete not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(undefined);
    await expect(service.softDelete(999)).rejects.toThrow(
      'Barang tidak ditemukan',
    );
  });

  /**
   * Menguji pengambilan seluruh barang.
   * @returns Daftar barang.
   */
  it('should find all barang', async () => {
    const qb = {
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockBarang]),
    };
    (repo.createQueryBuilder as jest.Mock).mockReturnValue(qb);

    const result = await service.findAll();
    expect(qb.getMany).toHaveBeenCalled();
    expect(result).toEqual([mockBarang]);
  });

  /**
   * Menguji pencarian barang berdasarkan id.
   * @returns Barang yang ditemukan.
   */
  it('should find one barang by id', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(mockBarang);
    const result = await service.findOne(1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mockBarang);
  });

  /**
   * Menguji error jika barang tidak ditemukan berdasarkan id.
   * @returns Error NotFoundException.
   */
  it('should throw NotFoundException if barang not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(undefined);
    await expect(service.findOne(999)).rejects.toThrow(
      'Barang tidak ditemukan',
    );
  });

  /**
   * Menguji penambahan stok pada barang aktif.
   * @returns Barang dengan stok bertambah.
   */
  it('should add stok to active barang', async () => {
    const barangAktif = { ...mockBarang, stok: 10, status_aktif: true };
    (repo.findOne as jest.Mock).mockResolvedValue(barangAktif);
    (repo.save as jest.Mock).mockResolvedValue({ ...barangAktif, stok: 15 });

    const result = await service.addStok(1, { jumlah: 5 });
    expect(result.stok).toBe(15);
    expect(repo.save).toHaveBeenCalled();
  });

  /**
   * Menguji error jika barang tidak aktif saat menambah stok.
   * @returns Error jika barang tidak aktif.
   */
  it('should throw error if barang not active', async () => {
    const barangNonAktif = { ...mockBarang, status_aktif: false };
    (repo.findOne as jest.Mock).mockResolvedValue(barangNonAktif);

    await expect(service.addStok(1, { jumlah: 5 })).rejects.toThrow(
      'Barang tidak aktif',
    );
  });

  /**
   * Menguji error jika barang tidak ditemukan saat menambah stok.
   * @returns Error NotFoundException.
   */
  it('should throw NotFoundException if barang to add stok not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(undefined);
    await expect(service.addStok(999, { jumlah: 5 })).rejects.toThrow(
      'Barang tidak ditemukan',
    );
  });

  /**
   * Menguji validasi jumlah negatif saat menambah stok.
   * @returns Error jika jumlah negatif.
   */
  it('should throw error if addStok called with negative jumlah', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(mockBarang);
    await expect(service.addStok(1, { jumlah: -5 })).rejects.toThrow();
  });

  /**
   * Menguji filter barang berdasarkan query string.
   * @returns Daftar barang yang sesuai filter q.
   */
  it('should filter barang by q', async () => {
    const qb = {
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockBarang]),
    };
    (repo.createQueryBuilder as jest.Mock).mockReturnValue(qb);

    const result = await service.findAll({ q: 'Kertas' });
    expect(qb.andWhere).toHaveBeenCalledWith(
      '(barang.nama_barang ILIKE :q OR barang.kode_barang ILIKE :q)',
      { q: '%Kertas%' },
    );
    expect(qb.getMany).toHaveBeenCalled();
    expect(result).toEqual([mockBarang]);
  });

  /**
   * Menguji filter barang berdasarkan status_aktif.
   * @returns Daftar barang dengan status_aktif tertentu.
   */
  it('should filter barang by status_aktif', async () => {
    const qb = {
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockBarang]),
    };
    (repo.createQueryBuilder as jest.Mock).mockReturnValue(qb);

    const result = await service.findAll({ status_aktif: true });
    expect(qb.andWhere).toHaveBeenCalledWith('barang.status_aktif = :status', {
      status: true,
    });
    expect(qb.getMany).toHaveBeenCalled();
    expect(result).toEqual([mockBarang]);
  });

  /**
   * Menguji pengambilan barang dengan stok kritis.
   * @returns Daftar barang dengan stok di bawah ambang batas kritis.
   */
  it('should return barang with stok kritis', async () => {
    const kritisBarang = {
      ...mockBarang,
      stok: 5,
      ambang_batas_kritis: 10,
      status_aktif: true,
    };
    const qb = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([kritisBarang]),
    };
    repo.createQueryBuilder = jest.fn().mockReturnValue(qb);
    const result = await service.getStokKritis();
    expect(qb.where).toHaveBeenCalledWith(
      'barang.stok <= barang.ambang_batas_kritis',
    );
    expect(qb.andWhere).toHaveBeenCalledWith('barang.status_aktif = :aktif', {
      aktif: true,
    });
    expect(result).toEqual([kritisBarang]);
  });

  /**
   * Menguji pembuatan buffer PDF untuk laporan penggunaan barang.
   * @param tanggal_awal Tanggal awal periode laporan
   * @param tanggal_akhir Tanggal akhir periode laporan
   * @returns Buffer PDF laporan penggunaan
   */
  it('should generate PDF buffer for laporan penggunaan', async () => {
    (repo.query as jest.Mock).mockResolvedValue([
      { nama_barang: 'Kertas', satuan: 'rim', total_digunakan: 5 },
    ]);
    const buffer = await service.generateLaporanPenggunaanPDF(
      '2024-07-01',
      '2024-07-31',
    );
    expect(Buffer.isBuffer(buffer)).toBe(true);
  });
});

describe('Barang DTO Validation', () => {
  /**
   * Menguji validasi kode_barang dengan karakter tidak valid.
   * @returns Error validasi pada kode_barang.
   */
  it('should fail if kode_barang contains invalid chars', async () => {
    const dto = plainToInstance(CreateBarangDto, {
      kode_barang: 'BRG 001!',
      nama_barang: 'Barang',
      satuan: 'pcs',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.matches).toBeDefined();
  });

  /**
   * Menguji validasi stok negatif pada DTO.
   * @returns Error validasi pada stok.
   */
  it('should fail if stok is negative', async () => {
    const dto = plainToInstance(CreateBarangDto, {
      kode_barang: 'BRG001',
      nama_barang: 'Barang',
      satuan: 'pcs',
      stok: -5,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.min).toBeDefined();
  });

  /**
   * Menguji validasi DTO dengan data yang valid.
   * @returns Tidak ada error validasi.
   */
  it('should pass with valid data', async () => {
    const dto = plainToInstance(CreateBarangDto, {
      kode_barang: 'BRG001',
      nama_barang: 'Barang',
      satuan: 'pcs',
      stok: 10,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
