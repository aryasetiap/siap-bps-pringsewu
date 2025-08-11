/**
 * File ini berisi unit test untuk PermintaanService pada aplikasi SIAP.
 * Pengujian meliputi proses pembuatan permintaan, verifikasi, pengambilan riwayat, statistik dashboard,
 * tren bulanan, dan pembuatan bukti permintaan dalam bentuk PDF.
 *
 * Setiap fungsi dan skenario diuji untuk memastikan validasi bisnis pengelolaan barang dan permintaan berjalan sesuai ketentuan.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PermintaanService } from './permintaan.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permintaan } from '../entities/permintaan.entity';
import { DetailPermintaan } from '../entities/detail_permintaan.entity';
import { Barang } from '../entities/barang.entity';
import { DataSource } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

/**
 * Membuat mock repository untuk entitas Permintaan.
 */
const mockPermintaanRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  count: jest.fn(),
  createQueryBuilder: jest.fn(),
});

/**
 * Membuat mock repository untuk entitas DetailPermintaan.
 */
const mockDetailRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
});

/**
 * Membuat mock repository untuk entitas Barang.
 */
const mockBarangRepo = () => ({
  findByIds: jest.fn(),
  findOne: jest.fn(),
  count: jest.fn(),
  createQueryBuilder: jest.fn(),
});

/**
 * Membuat mock DataSource untuk transaksi database.
 */
const mockDataSource = {
  transaction: jest.fn(),
};

describe('PermintaanService', () => {
  let service: PermintaanService;
  let permintaanRepo: ReturnType<typeof mockPermintaanRepo>;
  let detailRepo: ReturnType<typeof mockDetailRepo>;
  let barangRepo: ReturnType<typeof mockBarangRepo>;

  /**
   * Inisialisasi modul testing dan mock repository sebelum setiap pengujian.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermintaanService,
        {
          provide: getRepositoryToken(Permintaan),
          useFactory: mockPermintaanRepo,
        },
        {
          provide: getRepositoryToken(DetailPermintaan),
          useFactory: mockDetailRepo,
        },
        { provide: getRepositoryToken(Barang), useFactory: mockBarangRepo },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<PermintaanService>(PermintaanService);
    permintaanRepo = module.get(getRepositoryToken(Permintaan));
    detailRepo = module.get(getRepositoryToken(DetailPermintaan));
    barangRepo = module.get(getRepositoryToken(Barang));
  });

  /**
   * Membersihkan semua mock setelah setiap pengujian.
   */
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Pengujian proses pembuatan permintaan barang.
   */
  describe('create', () => {
    /**
     * Fungsi ini menguji validasi jika barang tidak ditemukan.
     *
     * Parameter:
     * - dto (any): Data permintaan barang
     * - idUser (number): ID user pemohon
     *
     * Return:
     * - Promise<void>
     */
    it('should throw BadRequestException if barang not found', async () => {
      barangRepo.findByIds.mockResolvedValue([]);
      const dto = { items: [{ id_barang: 1, jumlah: 2 }] };
      await expect(service.create(dto as any, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    /**
     * Fungsi ini menguji validasi jika hasil findByIds null.
     */
    it('should throw BadRequestException if barangRepo.findByIds returns null', async () => {
      barangRepo.findByIds.mockResolvedValue(null);
      const dto = { items: [{ id_barang: 1, jumlah: 2 }] };
      await expect(service.create(dto as any, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    /**
     * Fungsi ini menguji validasi jika stok barang kurang dari jumlah permintaan.
     */
    it('should throw BadRequestException if stok kurang', async () => {
      barangRepo.findByIds.mockResolvedValue([
        { id: 1, stok: 1, nama_barang: 'Barang A' },
      ]);
      const dto = { items: [{ id_barang: 1, jumlah: 2 }] };
      await expect(service.create(dto as any, 1)).rejects.toThrow(
        /Stok barang/,
      );
    });

    /**
     * Fungsi ini menguji validasi jika items permintaan kosong.
     */
    it('should throw BadRequestException if items is empty', async () => {
      const dto = { items: [] };
      await expect(service.create(dto as any, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    /**
     * Fungsi ini menguji proses pembuatan permintaan dan detail dalam transaksi database.
     */
    it('should create permintaan and details in transaction', async () => {
      barangRepo.findByIds.mockResolvedValue([
        { id: 1, stok: 10, nama_barang: 'Barang A' },
      ]);
      permintaanRepo.create.mockReturnValue({ id: 123, status: 'Menunggu' });
      detailRepo.create.mockReturnValue({ id: 456 });
      const dto = { items: [{ id_barang: 1, jumlah: 2 }], catatan: 'test' };

      mockDataSource.transaction.mockImplementation(async (cb) => {
        return cb({
          save: jest
            .fn()
            .mockResolvedValueOnce({ id: 123, status: 'Menunggu' })
            .mockResolvedValueOnce([{ id: 456 }]),
        });
      });

      const result = await service.create(dto as any, 1);
      expect(result.items[0].id).toBe(456);
      expect(result.status).toBe('Menunggu');
    });

    /**
     * Fungsi ini menguji validasi jika barang status_aktif = false.
     */
    it('should throw BadRequestException if barang status_aktif is false', async () => {
      barangRepo.findByIds.mockResolvedValue([
        { id: 1, stok: 10, nama_barang: 'Barang A', status_aktif: false },
      ]);
      const dto = { items: [{ id_barang: 1, jumlah: 2 }] };
      await expect(service.create(dto as any, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  /**
   * Pengujian pengambilan riwayat permintaan berdasarkan user.
   */
  describe('getRiwayatByUser', () => {
    /**
     * Fungsi ini menguji pengambilan riwayat permintaan user.
     *
     * Parameter:
     * - idUser (number): ID user pemohon
     *
     * Return:
     * - Promise<any[]>
     */
    it('should call find with correct params', async () => {
      permintaanRepo.find.mockResolvedValue([{ id: 1 }]);
      const result = await service.getRiwayatByUser(1);
      expect(permintaanRepo.find).toHaveBeenCalledWith({
        where: { id_user_pemohon: 1 },
        order: { tanggal_permintaan: 'DESC' },
        relations: ['details', 'details.barang'],
      });
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  /**
   * Pengujian pengambilan satu permintaan berdasarkan ID.
   */
  describe('findOneById', () => {
    /**
     * Fungsi ini menguji validasi jika permintaan tidak ditemukan.
     *
     * Parameter:
     * - id (number): ID permintaan
     *
     * Return:
     * - Promise<any>
     */
    it('should throw NotFoundException if not found', async () => {
      permintaanRepo.findOne.mockResolvedValue(null);
      await expect(service.findOneById(1)).rejects.toThrow(NotFoundException);
    });

    /**
     * Fungsi ini menguji pengambilan permintaan beserta detailnya.
     */
    it('should return permintaan with items', async () => {
      permintaanRepo.findOne.mockResolvedValue({ id: 1, details: [{ id: 2 }] });
      const result = await service.findOneById(1);
      expect(result.items).toEqual([{ id: 2 }]);
    });
  });

  /**
   * Pengujian pengambilan daftar permintaan yang masih menunggu verifikasi.
   */
  describe('getPermintaanMenunggu', () => {
    /**
     * Fungsi ini menguji pengambilan permintaan dengan status 'Menunggu'.
     *
     * Return:
     * - Promise<any[]>
     */
    it('should call find with correct params', async () => {
      permintaanRepo.find.mockResolvedValue([{ id: 1 }]);
      const result = await service.getPermintaanMenunggu();
      expect(permintaanRepo.find).toHaveBeenCalledWith({
        where: { status: 'Menunggu' },
        order: { tanggal_permintaan: 'ASC' },
        relations: ['details', 'details.barang', 'pemohon'],
      });
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  /**
   * Pengujian proses verifikasi permintaan barang.
   */
  describe('verifikasiPermintaan', () => {
    /**
     * Fungsi ini menguji validasi jika permintaan tidak ditemukan.
     */
    it('should throw NotFoundException if permintaan not found', async () => {
      mockDataSource.transaction.mockImplementation(async (cb) => {
        await cb({
          findOne: jest.fn().mockResolvedValue(null),
        });
      });
      await expect(
        service.verifikasiPermintaan(1, { items: [] } as any, 1),
      ).rejects.toThrow(NotFoundException);
    });

    /**
     * Fungsi ini menguji validasi jika permintaan sudah diverifikasi.
     */
    it('should throw BadRequestException if permintaan sudah diverifikasi', async () => {
      mockDataSource.transaction.mockImplementation(async (cb) => {
        await cb({
          findOne: jest.fn().mockResolvedValue({ status: 'Disetujui' }),
        });
      });
      await expect(
        service.verifikasiPermintaan(1, { items: [] } as any, 1),
      ).rejects.toThrow(BadRequestException);
    });

    /**
     * Fungsi ini menguji validasi jika detail permintaan tidak ditemukan.
     */
    it('should throw BadRequestException if detail tidak ditemukan', async () => {
      const permintaan = {
        status: 'Menunggu',
        details: [],
      };
      mockDataSource.transaction.mockImplementation(async (cb) => {
        await cb({
          findOne: jest.fn().mockResolvedValue(permintaan),
        });
      });
      await expect(
        service.verifikasiPermintaan(
          1,
          {
            items: [{ id_detail: 99, jumlah_disetujui: 1 }],
            keputusan: 'setuju',
          } as any,
          1,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    /**
     * Fungsi ini menguji validasi jika stok barang tidak mencukupi.
     */
    it('should throw BadRequestException if stok tidak cukup', async () => {
      const permintaan = {
        status: 'Menunggu',
        catatan: '',
        details: [
          {
            id: 1,
            jumlah_diminta: 2,
            jumlah_disetujui: 0,
            barang: { stok: 0, nama_barang: 'Barang A' },
          },
        ],
      };
      mockDataSource.transaction.mockImplementation(async (cb) => {
        await cb({
          findOne: jest.fn().mockResolvedValue(permintaan),
          save: jest.fn(),
        });
      });
      await expect(
        service.verifikasiPermintaan(
          1,
          {
            items: [{ id_detail: 1, jumlah_disetujui: 1 }],
            keputusan: 'setuju',
          } as any,
          1,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    /**
     * Fungsi ini menguji validasi jika jumlah disetujui melebihi jumlah diminta.
     */
    it('should throw BadRequestException if jumlah_disetujui > jumlah_diminta', async () => {
      const permintaan = {
        status: 'Menunggu',
        details: [
          {
            id: 1,
            jumlah_diminta: 2,
            jumlah_disetujui: 0,
            barang: { stok: 10, nama_barang: 'Barang A' },
          },
        ],
      };
      mockDataSource.transaction.mockImplementation(async (cb) => {
        await cb({
          findOne: jest.fn().mockResolvedValue(permintaan),
          save: jest.fn(),
        });
      });
      await expect(
        service.verifikasiPermintaan(
          1,
          {
            items: [{ id_detail: 1, jumlah_disetujui: 3 }],
            keputusan: 'setuju',
          } as any,
          1,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    /**
     * Fungsi ini menguji validasi jika keputusan verifikasi tidak valid.
     */
    it('should throw BadRequestException if keputusan is invalid', async () => {
      const permintaan = {
        status: 'Menunggu',
        details: [
          {
            id: 1,
            jumlah_diminta: 2,
            jumlah_disetujui: 0,
            barang: { stok: 10, nama_barang: 'Barang A' },
          },
        ],
      };
      mockDataSource.transaction.mockImplementation(async (cb) => {
        return cb({
          findOne: jest.fn().mockResolvedValue(permintaan),
          save: jest.fn(),
        });
      });
      const dto = {
        items: [{ id_detail: 1, jumlah_disetujui: 1 }],
        keputusan: 'invalid',
      };
      await expect(
        service.verifikasiPermintaan(1, dto as any, 1),
      ).rejects.toThrow(BadRequestException);
    });

    /**
     * Fungsi ini menguji proses update status dan stok barang jika verifikasi disetujui.
     */
    it('should update status and stok if verifikasi setuju', async () => {
      const permintaan = {
        status: 'Menunggu',
        catatan: '',
        details: [
          {
            id: 1,
            jumlah_diminta: 2,
            jumlah_disetujui: 0,
            barang: { stok: 10, nama_barang: 'Barang A' },
          },
        ],
      };
      const saveMock = jest.fn();
      mockDataSource.transaction.mockImplementation(async (cb) => {
        return cb({
          findOne: jest.fn().mockResolvedValue(permintaan),
          save: saveMock,
        });
      });
      const dto = {
        items: [{ id_detail: 1, jumlah_disetujui: 2 }],
        keputusan: 'setuju',
        catatan_verifikasi: 'OK',
      };
      const result = await service.verifikasiPermintaan(1, dto as any, 99);
      expect(result.status).toBe('Disetujui');
      expect(permintaan.details[0].barang.stok).toBe(8);
      expect(permintaan.catatan).toBe('OK');
    });

    /**
     * Fungsi ini menguji proses update status permintaan menjadi Ditolak.
     */
    it('should set status Ditolak if keputusan tolak', async () => {
      const permintaan = {
        status: 'Menunggu',
        catatan: '',
        details: [
          {
            id: 1,
            jumlah_diminta: 2,
            jumlah_disetujui: 0,
            barang: { stok: 10, nama_barang: 'Barang A' },
          },
        ],
      };
      const saveMock = jest.fn();
      mockDataSource.transaction.mockImplementation(async (cb) => {
        return cb({
          findOne: jest.fn().mockResolvedValue(permintaan),
          save: saveMock,
        });
      });
      const dto = {
        items: [{ id_detail: 1, jumlah_disetujui: 0 }],
        keputusan: 'tolak',
        catatan_verifikasi: 'Ditolak',
      };
      const result = await service.verifikasiPermintaan(1, dto as any, 99);
      expect(result.status).toBe('Ditolak');
      expect(result.catatan).toBe('Ditolak');
    });

    /**
     * Fungsi ini menguji validasi jika status permintaan bukan 'Menunggu'.
     */
    it('should throw BadRequestException if permintaan status is not Menunggu', async () => {
      mockDataSource.transaction.mockImplementation(async (cb) => {
        await cb({
          findOne: jest.fn().mockResolvedValue({ status: 'Ditolak' }),
        });
      });
      await expect(
        service.verifikasiPermintaan(
          1,
          {
            items: [{ id_detail: 1, jumlah_disetujui: 1 }],
            keputusan: 'setuju',
          } as any,
          1,
        ),
      ).rejects.toThrow('Permintaan sudah diverifikasi');
    });

    /**
     * Fungsi ini menguji validasi jika pengurangan stok menyebabkan stok minus.
     */
    it('should throw BadRequestException if pengurangan stok menyebabkan stok minus', async () => {
      const permintaan = {
        status: 'Menunggu',
        details: [
          {
            id: 1,
            jumlah_diminta: 1,
            jumlah_disetujui: 0,
            barang: { stok: 0, nama_barang: 'Barang A' },
          },
        ],
      };
      mockDataSource.transaction.mockImplementation(async (cb) => {
        await cb({
          findOne: jest.fn().mockResolvedValue(permintaan),
          save: jest.fn(),
        });
      });
      await expect(
        service.verifikasiPermintaan(
          1,
          {
            items: [{ id_detail: 1, jumlah_disetujui: 1 }],
            keputusan: 'setuju',
          } as any,
          1,
        ),
      ).rejects.toThrow(/tidak mencukupi/);
    });
  });

  /**
   * Pengujian pengambilan statistik dashboard terkait barang dan permintaan.
   */
  describe('getDashboardStatistik', () => {
    /**
     * Fungsi ini menguji pengambilan statistik dashboard SIAP.
     *
     * Return:
     * - Promise<{ totalBarang: number, totalPermintaanTertunda: number, totalBarangKritis: number }>
     */
    it('should return dashboard statistik', async () => {
      barangRepo.count.mockResolvedValue(10);
      permintaanRepo.count.mockResolvedValue(2);
      barangRepo.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(3),
      });
      const result = await service.getDashboardStatistik();
      expect(result).toEqual({
        totalBarang: 10,
        totalPermintaanTertunda: 2,
        totalBarangKritis: 3,
      });
    });
  });

  /**
   * Pengujian pengambilan tren permintaan bulanan.
   */
  describe('getTrenPermintaanBulanan', () => {
    /**
     * Fungsi ini menguji pengambilan tren permintaan bulanan.
     *
     * Return:
     * - Promise<Array<{ bulan: string, jumlah: number }>>
     */
    it('should return tren permintaan bulanan', async () => {
      permintaanRepo.createQueryBuilder = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { bulan: '2024-07', jumlah: 5 },
          { bulan: '2024-08', jumlah: 2 },
        ]),
      });
      const result = await service.getTrenPermintaanBulanan();
      expect(Array.isArray(result)).toBe(true);
      expect(result.some((r) => r.bulan === '2024-07')).toBe(true);
    });
  });

  /**
   * Pengujian pembuatan bukti permintaan dalam bentuk PDF.
   */
  describe('generateBuktiPermintaanPDF', () => {
    /**
     * Fungsi ini menguji pembuatan buffer PDF untuk bukti permintaan barang.
     *
     * Parameter:
     * - idPermintaan (number): ID permintaan
     *
     * Return:
     * - Promise<Buffer>
     */
    it('should generate PDF buffer for bukti permintaan', async () => {
      service.findOneById = jest.fn().mockResolvedValue({
        id: 1,
        tanggal_permintaan: new Date(),
        pemohon: { nama: 'Budi', unit_kerja: 'Statistik' },
        status: 'Disetujui',
        catatan: 'Test',
        items: [
          {
            barang: { nama_barang: 'Kertas', satuan: 'rim' },
            jumlah_diminta: 2,
            jumlah_disetujui: 2,
          },
        ],
      });
      const buffer = await service.generateBuktiPermintaanPDF(1);
      expect(Buffer.isBuffer(buffer)).toBe(true);
    });
  });
});
