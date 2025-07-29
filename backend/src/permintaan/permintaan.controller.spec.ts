import { Test, TestingModule } from '@nestjs/testing';
import { PermintaanController } from './permintaan.controller';
import { PermintaanService } from './permintaan.service';
import { ForbiddenException } from '@nestjs/common';
import { Response } from 'express';

const mockPermintaanService = () => ({
  create: jest.fn(),
  getRiwayatByUser: jest.fn(),
  getPermintaanMenunggu: jest.fn(),
  findOneById: jest.fn(),
  verifikasiPermintaan: jest.fn(), // tambahkan ini
  generateBuktiPermintaanPDF: jest.fn(),
  getDashboardStatistik: jest.fn(),
  getTrenPermintaanBulanan: jest.fn(),
});

describe('PermintaanController', () => {
  let controller: PermintaanController;
  let service: ReturnType<typeof mockPermintaanService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermintaanController],
      providers: [
        { provide: PermintaanService, useFactory: mockPermintaanService },
      ],
    }).compile();

    controller = module.get<PermintaanController>(PermintaanController);
    service = module.get(PermintaanService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call service.create with correct params', async () => {
      const dto = { items: [{ id_barang: 1, jumlah: 2 }], catatan: 'test' };
      const req = { user: { userId: 42, role: 'pegawai' } };
      service.create.mockResolvedValue({ id: 1 });
      const result = await controller.create(dto as any, req as any);
      expect(service.create).toHaveBeenCalledWith(dto, 42);
      expect(result).toEqual({ id: 1 });
    });

    it('should handle error on create', async () => {
      service.create.mockRejectedValue(new Error('Create error'));
      const req = { user: { userId: 1, role: 'pegawai' } };
      await expect(controller.create({} as any, req as any)).rejects.toThrow(
        'Create error',
      );
    });
  });

  describe('getRiwayat', () => {
    it('should call service.getRiwayatByUser with userId', async () => {
      const req = { user: { userId: 42, role: 'pegawai' } };
      service.getRiwayatByUser.mockResolvedValue([{ id: 1 }]);
      const result = await controller.getRiwayat(req as any);
      expect(service.getRiwayatByUser).toHaveBeenCalledWith(42);
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe('getPermintaanMasuk', () => {
    it('should throw ForbiddenException if not admin', async () => {
      const req = { user: { userId: 42, role: 'pegawai' } };
      await expect(controller.getPermintaanMasuk(req as any)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should call service.getPermintaanMenunggu if admin', async () => {
      const req = { user: { userId: 1, role: 'admin' } };
      service.getPermintaanMenunggu.mockResolvedValue([{ id: 2 }]);
      const result = await controller.getPermintaanMasuk(req as any);
      expect(service.getPermintaanMenunggu).toHaveBeenCalled();
      expect(result).toEqual([{ id: 2 }]);
    });
  });

  describe('findOne', () => {
    it('should throw ForbiddenException if pegawai akses milik orang lain', async () => {
      const req = { user: { userId: 42, role: 'pegawai' } };
      service.findOneById.mockResolvedValue({ id_user_pemohon: 99 });
      await expect(controller.findOne(req as any, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should return permintaan if pegawai akses milik sendiri', async () => {
      const req = { user: { userId: 42, role: 'pegawai' } };
      const permintaan = { id: 1, id_user_pemohon: 42 };
      service.findOneById.mockResolvedValue(permintaan);
      const result = await controller.findOne(req as any, 1);
      expect(service.findOneById).toHaveBeenCalledWith(1);
      expect(result).toEqual(permintaan);
    });

    it('should return permintaan if admin', async () => {
      const req = { user: { userId: 1, role: 'admin' } };
      const permintaan = { id: 1, id_user_pemohon: 42 };
      service.findOneById.mockResolvedValue(permintaan);
      const result = await controller.findOne(req as any, 1);
      expect(result).toEqual(permintaan);
    });
  });

  describe('verifikasi', () => {
    it('should call service.verifikasiPermintaan with correct params', async () => {
      const req = { user: { userId: 1, role: 'admin' } };
      const dto = {
        keputusan: 'setuju',
        items: [{ id_detail: 1, jumlah_disetujui: 2 }],
        catatan_verifikasi: 'OK',
      };
      service.verifikasiPermintaan.mockResolvedValue({ status: 'Disetujui' });
      const result = await controller.verifikasi(1, dto as any, req as any);
      expect(service.verifikasiPermintaan).toHaveBeenCalledWith(1, dto, 1);
      expect(result).toEqual({ status: 'Disetujui' });
    });

    it('should handle error on verifikasi', async () => {
      service.verifikasiPermintaan.mockRejectedValue(
        new Error('Verifikasi error'),
      );
      const req = { user: { userId: 1, role: 'admin' } };
      await expect(
        controller.verifikasi(1, {} as any, req as any),
      ).rejects.toThrow('Verifikasi error');
    });
  });

  describe('generateBuktiPermintaanPDF', () => {
    it('should call service.generateBuktiPermintaanPDF and send PDF', async () => {
      const mockBuffer = Buffer.from('PDFDATA');
      service.generateBuktiPermintaanPDF = jest
        .fn()
        .mockResolvedValue(mockBuffer);
      const res = {
        set: jest.fn().mockReturnThis(),
        end: jest.fn(),
      } as any;
      await controller.generateBuktiPermintaanPDF(1, res);
      expect(service.generateBuktiPermintaanPDF).toHaveBeenCalledWith(1);
      expect(res.set).toHaveBeenCalledWith(
        expect.objectContaining({
          'Content-Type': 'application/pdf',
        }),
      );
      expect(res.end).toHaveBeenCalledWith(mockBuffer);
    });

    it('should handle error in generateBuktiPermintaanPDF', async () => {
      service.generateBuktiPermintaanPDF = jest
        .fn()
        .mockRejectedValue(new Error('Not found'));
      const res = {
        set: jest.fn().mockReturnThis(),
        end: jest.fn(),
      } as any;
      await expect(
        controller.generateBuktiPermintaanPDF(999, res),
      ).rejects.toThrow('Not found');
    });
  });

  describe('getDashboardStatistik', () => {
    it('should call service.getDashboardStatistik', async () => {
      service.getDashboardStatistik.mockResolvedValue({ totalBarang: 1 });
      const result = await controller.getDashboardStatistik();
      expect(service.getDashboardStatistik).toHaveBeenCalled();
      expect(result).toEqual({ totalBarang: 1 });
    });
  });

  describe('getTrenPermintaanBulanan', () => {
    it('should call service.getTrenPermintaanBulanan', async () => {
      service.getTrenPermintaanBulanan.mockResolvedValue([
        { bulan: '2024-07', jumlah: 2 },
      ]);
      const result = await controller.getTrenPermintaanBulanan();
      expect(service.getTrenPermintaanBulanan).toHaveBeenCalled();
      expect(result).toEqual([{ bulan: '2024-07', jumlah: 2 }]);
    });
  });
});
