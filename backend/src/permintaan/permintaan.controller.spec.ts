/**
 * File ini berisi pengujian unit untuk PermintaanController pada aplikasi SIAP.
 * Pengujian meliputi proses permintaan barang, verifikasi, riwayat, dashboard, dan pembuatan bukti PDF.
 * Setiap fungsi diuji agar sesuai dengan kebutuhan bisnis pengelolaan barang dan permintaan di SIAP.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PermintaanController } from './permintaan.controller';
import { PermintaanService } from './permintaan.service';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

/**
 * Fungsi ini membuat mock dari PermintaanService untuk keperluan pengujian.
 *
 * Return:
 * - object: Mock dari seluruh fungsi pada PermintaanService.
 */
const createMockPermintaanService = () => ({
  create: jest.fn(),
  getRiwayatByUser: jest.fn(),
  getPermintaanMenunggu: jest.fn(),
  findOneById: jest.fn(),
  verifikasiPermintaan: jest.fn(),
  generateBuktiPermintaanPDF: jest.fn(),
  getDashboardStatistik: jest.fn(),
  getTrenPermintaanBulanan: jest.fn(),
  getAllPermintaan: jest.fn(),
});

describe('PermintaanController', () => {
  let controller: PermintaanController;
  let service: ReturnType<typeof createMockPermintaanService>;

  /**
   * Inisialisasi modul testing dan controller sebelum setiap pengujian.
   *
   * Parameter: Tidak ada.
   * Return: Tidak ada.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermintaanController],
      providers: [
        { provide: PermintaanService, useFactory: createMockPermintaanService },
      ],
    }).compile();

    controller = module.get<PermintaanController>(PermintaanController);
    service = module.get(PermintaanService);
  });

  /**
   * Membersihkan seluruh mock setelah setiap pengujian agar tidak terjadi efek samping.
   *
   * Parameter: Tidak ada.
   * Return: Tidak ada.
   */
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Pengujian proses pembuatan permintaan barang oleh user.
   */
  describe('create', () => {
    /**
     * Menguji pemanggilan service.create dengan parameter yang benar.
     *
     * Parameter: Tidak ada.
     * Return: Tidak ada.
     */
    it('should call service.create with correct params', async () => {
      const dto = { items: [{ id_barang: 1, jumlah: 2 }], catatan: 'test' };
      const req = { user: { userId: 42, role: 'pegawai' } };
      service.create.mockResolvedValue({ id: 1 });

      const result = await controller.create(dto as any, req as any);

      expect(service.create).toHaveBeenCalledWith(dto, 42);
      expect(result).toEqual({ id: 1 });
    });

    /**
     * Menguji penanganan error pada proses create permintaan barang.
     */
    it('should handle error on create', async () => {
      service.create.mockRejectedValue(new Error('Create error'));
      const req = { user: { userId: 1, role: 'pegawai' } };

      await expect(controller.create({} as any, req as any)).rejects.toThrow(
        'Create error',
      );
    });
  });

  /**
   * Pengujian pengambilan riwayat permintaan barang oleh user.
   */
  describe('getRiwayat', () => {
    /**
     * Menguji pemanggilan service.getRiwayatByUser dengan userId yang benar.
     */
    it('should call service.getRiwayatByUser with userId', async () => {
      const req = { user: { userId: 42, role: 'pegawai' } };
      service.getRiwayatByUser.mockResolvedValue([{ id: 1 }]);

      const result = await controller.getRiwayat(req as any);

      expect(service.getRiwayatByUser).toHaveBeenCalledWith(42);
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  /**
   * Pengujian pengambilan daftar permintaan masuk (menunggu verifikasi) oleh admin.
   */
  describe('getPermintaanMasuk', () => {
    /**
     * Menguji jika user bukan admin maka akan dilempar ForbiddenException.
     */
    it('should throw ForbiddenException if not admin', async () => {
      const req = { user: { userId: 42, role: 'pegawai' } };

      await expect(controller.getPermintaanMasuk(req as any)).rejects.toThrow(
        ForbiddenException,
      );
    });

    /**
     * Menguji pemanggilan service.getPermintaanMenunggu jika user adalah admin.
     */
    it('should call service.getPermintaanMenunggu if admin', async () => {
      const req = { user: { userId: 1, role: 'admin' } };
      service.getPermintaanMenunggu.mockResolvedValue([{ id: 2 }]);

      const result = await controller.getPermintaanMasuk(req as any);

      expect(service.getPermintaanMenunggu).toHaveBeenCalled();
      expect(result).toEqual([{ id: 2 }]);
    });
  });

  /**
   * Pengujian pengambilan detail permintaan barang berdasarkan id.
   */
  describe('findOne', () => {
    /**
     * Menguji jika pegawai mengakses permintaan milik orang lain maka ForbiddenException dilempar.
     */
    it('should throw ForbiddenException if pegawai akses milik orang lain', async () => {
      const req = { user: { userId: 42, role: 'pegawai' } };
      service.findOneById.mockResolvedValue({ id_user_pemohon: 99 });

      await expect(controller.findOne(req as any, '1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    /**
     * Menguji jika pegawai mengakses permintaan milik sendiri maka data dikembalikan.
     */
    it('should return permintaan if pegawai akses milik sendiri', async () => {
      const req = { user: { userId: 42, role: 'pegawai' } };
      const permintaan = { id: 1, id_user_pemohon: 42 };
      service.findOneById.mockResolvedValue(permintaan);

      const result = await controller.findOne(req as any, '1');

      expect(service.findOneById).toHaveBeenCalledWith(1);
      expect(result).toEqual(permintaan);
    });

    /**
     * Menguji jika admin mengakses permintaan maka data dikembalikan.
     */
    it('should return permintaan if admin', async () => {
      const req = { user: { userId: 1, role: 'admin' } };
      const permintaan = { id: 1, id_user_pemohon: 42 };
      service.findOneById.mockResolvedValue(permintaan);

      const result = await controller.findOne(req as any, '1');

      expect(result).toEqual(permintaan);
    });

    /**
     * Menguji jika id tidak valid, maka akan melempar BadRequestException.
     */
    it('should throw BadRequestException if id is invalid', async () => {
      const req = { user: { userId: 1, role: 'admin' } };

      await expect(controller.findOne(req as any, 'abc')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  /**
   * Pengujian proses verifikasi permintaan barang oleh admin.
   */
  describe('verifikasi', () => {
    /**
     * Menguji pemanggilan service.verifikasiPermintaan dengan parameter yang benar.
     */
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

    /**
     * Menguji penanganan error pada proses verifikasi permintaan barang.
     */
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

  /**
   * Pengujian pembuatan dan pengiriman bukti permintaan barang dalam bentuk PDF.
   */
  describe('generateBuktiPermintaanPDF', () => {
    /**
     * Menguji pemanggilan service.generateBuktiPermintaanPDF dan pengiriman PDF ke response.
     *
     * Penjelasan: Fungsi ini menguji apakah controller dapat menghasilkan dan mengirimkan file PDF bukti permintaan barang.
     */
    it('should call service.generateBuktiPermintaanPDF and send PDF', async () => {
      const mockBuffer = Buffer.from('PDFDATA');
      service.generateBuktiPermintaanPDF = jest
        .fn()
        .mockResolvedValue(mockBuffer);

      const res = {
        set: jest.fn().mockReturnThis(),
        end: jest.fn(),
      } as any;

      const req = { user: { userId: 1, role: 'admin' } };
      await controller.generateBuktiPermintaanPDF(1, res, req);

      expect(service.generateBuktiPermintaanPDF).toHaveBeenCalledWith(1);
      expect(res.set).toHaveBeenCalledWith(
        expect.objectContaining({ 'Content-Type': 'application/pdf' }),
      );
      expect(res.end).toHaveBeenCalledWith(mockBuffer);
    });

    /**
     * Menguji penanganan error pada proses generateBuktiPermintaanPDF.
     */
    it('should handle error in generateBuktiPermintaanPDF', async () => {
      service.generateBuktiPermintaanPDF = jest
        .fn()
        .mockRejectedValue(new Error('Not found'));

      const res = {
        set: jest.fn().mockReturnThis(),
        end: jest.fn(),
      } as any;

      const req = { user: { userId: 1, role: 'admin' } };
      await expect(
        controller.generateBuktiPermintaanPDF(999, res, req),
      ).rejects.toThrow('Not found');
    });
  });

  /**
   * Pengujian pengambilan statistik dashboard terkait permintaan barang.
   */
  describe('getDashboardStatistik', () => {
    /**
     * Menguji pemanggilan service.getDashboardStatistik.
     */
    it('should call service.getDashboardStatistik', async () => {
      service.getDashboardStatistik.mockResolvedValue({ totalBarang: 1 });

      const result = await controller.getDashboardStatistik();

      expect(service.getDashboardStatistik).toHaveBeenCalled();
      expect(result).toEqual({ totalBarang: 1 });
    });
  });

  /**
   * Pengujian pengambilan tren permintaan barang bulanan untuk analisis.
   */
  describe('getTrenPermintaanBulanan', () => {
    /**
     * Menguji pemanggilan service.getTrenPermintaanBulanan.
     */
    it('should call service.getTrenPermintaanBulanan', async () => {
      service.getTrenPermintaanBulanan.mockResolvedValue([
        { bulan: '2024-07', jumlah: 2 },
      ]);

      const result = await controller.getTrenPermintaanBulanan();

      expect(service.getTrenPermintaanBulanan).toHaveBeenCalled();
      expect(result).toEqual([{ bulan: '2024-07', jumlah: 2 }]);
    });
  });

  /**
   * Pengujian pengambilan semua permintaan dengan filter, halaman, dan limit.
   */
  describe('getAllPermintaan', () => {
    /**
     * Menguji pemanggilan service.getAllPermintaan dengan parameter yang benar.
     */
    it('should call service.getAllPermintaan with correct params', async () => {
      service.getAllPermintaan = jest.fn().mockResolvedValue({
        data: [{ id: 1 }],
        total: 1,
        page: 1,
        limit: 20,
      });
      const result = await controller.getAllPermintaan('Menunggu', 1, 20);

      expect(service.getAllPermintaan).toHaveBeenCalledWith({
        status: 'Menunggu',
        page: 1,
        limit: 20,
      });
      expect(result).toEqual({
        data: [{ id: 1 }],
        total: 1,
        page: 1,
        limit: 20,
      });
    });

    /**
     * Menguji penanganan error pada proses pengambilan semua permintaan.
     */
    it('should handle error on getAllPermintaan', async () => {
      service.getAllPermintaan = jest
        .fn()
        .mockRejectedValue(new Error('Get error'));

      await expect(
        controller.getAllPermintaan('Menunggu', 1, 20),
      ).rejects.toThrow('Get error');
    });
  });
});
