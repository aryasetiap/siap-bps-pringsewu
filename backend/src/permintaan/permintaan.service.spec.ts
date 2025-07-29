import { Test, TestingModule } from '@nestjs/testing';
import { PermintaanService } from './permintaan.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permintaan } from '../entities/permintaan.entity';
import { DetailPermintaan } from '../entities/detail_permintaan.entity';
import { Barang } from '../entities/barang.entity';
import { DataSource } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockPermintaanRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  count: jest.fn(), // tambahkan ini
  createQueryBuilder: jest.fn(), // tambahkan ini
});
const mockDetailRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
});
const mockBarangRepo = () => ({
  findByIds: jest.fn(),
  findOne: jest.fn(),
  count: jest.fn(), // tambahkan ini
  createQueryBuilder: jest.fn(), // tambahkan ini
});

const mockDataSource = {
  transaction: jest.fn(),
};

describe('PermintaanService', () => {
  let service: PermintaanService;
  let permintaanRepo: ReturnType<typeof mockPermintaanRepo>;
  let detailRepo: ReturnType<typeof mockDetailRepo>;
  let barangRepo: ReturnType<typeof mockBarangRepo>;

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw BadRequestException if barang not found', async () => {
      barangRepo.findByIds.mockResolvedValue([]);
      const dto = { items: [{ id_barang: 1, jumlah: 2 }] };
      await expect(service.create(dto as any, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if barangRepo.findByIds returns null', async () => {
      barangRepo.findByIds.mockResolvedValue(null);
      const dto = { items: [{ id_barang: 1, jumlah: 2 }] };
      await expect(service.create(dto as any, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if stok kurang', async () => {
      barangRepo.findByIds.mockResolvedValue([
        { id: 1, stok: 1, nama_barang: 'Barang A' },
      ]);
      const dto = { items: [{ id_barang: 1, jumlah: 2 }] };
      await expect(service.create(dto as any, 1)).rejects.toThrow(
        /Stok barang/,
      );
    });

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
            .mockResolvedValueOnce({ id: 123, status: 'Menunggu' }) // permintaan
            .mockResolvedValueOnce([{ id: 456 }]), // details
        });
      });

      const result = await service.create(dto as any, 1);
      expect(result.items[0].id).toBe(456);
      expect(result.status).toBe('Menunggu');
    });
  });

  describe('getRiwayatByUser', () => {
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

  describe('findOneById', () => {
    it('should throw NotFoundException if not found', async () => {
      permintaanRepo.findOne.mockResolvedValue(null);
      await expect(service.findOneById(1)).rejects.toThrow(NotFoundException);
    });

    it('should return permintaan with items', async () => {
      permintaanRepo.findOne.mockResolvedValue({ id: 1, details: [{ id: 2 }] });
      const result = await service.findOneById(1);
      expect(result.items).toEqual([{ id: 2 }]);
    });
  });

  describe('getPermintaanMenunggu', () => {
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

  describe('verifikasiPermintaan', () => {
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

    it('should throw BadRequestException if stok tidak cukup', async () => {
      const permintaan = {
        status: 'Menunggu',
        catatan: '', // tambahkan ini
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

    it('should update status and stok if verifikasi setuju', async () => {
      const permintaan = {
        status: 'Menunggu',
        catatan: '', // tambahkan ini
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
  });

  describe('getDashboardStatistik', () => {
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

  describe('getTrenPermintaanBulanan', () => {
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

  describe('generateBuktiPermintaanPDF', () => {
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
