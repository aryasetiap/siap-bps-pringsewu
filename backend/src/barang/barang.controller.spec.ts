import { Test, TestingModule } from '@nestjs/testing';
import { BarangController } from './barang.controller';
import { BarangService } from './barang.service';
import { Response } from 'express';

describe('BarangController', () => {
  let controller: BarangController;

  /**
   * Menyiapkan modul pengujian dan menginisialisasi controller sebelum setiap pengujian.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarangController],
      providers: [
        {
          provide: BarangService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<BarangController>(BarangController);
  });

  /**
   * Menguji apakah controller berhasil didefinisikan.
   */
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /**
   * Menguji pemanggilan service.create saat fungsi create dipanggil.
   * @returns Promise<void>
   */
  it('should call service.create on create', async () => {
    const mockService = { create: jest.fn().mockResolvedValue({ id: 1 }) };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarangController],
      providers: [{ provide: BarangService, useValue: mockService }],
    }).compile();
    const controller = module.get<BarangController>(BarangController);
    await controller.create({
      kode_barang: 'BRG001',
      nama_barang: 'A',
      satuan: 'pcs',
    } as any);
    expect(mockService.create).toHaveBeenCalled();
  });

  /**
   * Menguji penanganan error pada fungsi create.
   * @returns Promise<void>
   */
  it('should handle error on create', async () => {
    const mockService = {
      create: jest.fn().mockRejectedValue(new Error('Create error')),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarangController],
      providers: [{ provide: BarangService, useValue: mockService }],
    }).compile();
    const controller = module.get<BarangController>(BarangController);
    await expect(controller.create({} as any)).rejects.toThrow('Create error');
  });

  /**
   * Menguji pemanggilan service.addStok saat fungsi addStok dipanggil.
   * @returns Promise<void>
   */
  it('should call service.addStok on addStok', async () => {
    const mockService = {
      addStok: jest.fn().mockResolvedValue({ id: 1, stok: 15 }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarangController],
      providers: [{ provide: BarangService, useValue: mockService }],
    }).compile();
    const controller = module.get<BarangController>(BarangController);
    await controller.addStok(1, { jumlah: 5 });
    expect(mockService.addStok).toHaveBeenCalledWith(1, { jumlah: 5 });
  });

  /**
   * Menguji pemanggilan service.generateLaporanPenggunaanPDF dan pengiriman file PDF ke response.
   * @returns Promise<void>
   */
  it('should call service.generateLaporanPenggunaanPDF and send PDF', async () => {
    const mockService = {
      generateLaporanPenggunaanPDF: jest
        .fn()
        .mockResolvedValue(Buffer.from('PDFDATA')),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarangController],
      providers: [{ provide: BarangService, useValue: mockService }],
    }).compile();
    const controller = module.get<BarangController>(BarangController);

    const res = {
      set: jest.fn().mockReturnThis(),
      end: jest.fn(),
    } as any;

    await controller.generateLaporanPenggunaanPDF(
      '2024-07-01',
      '2024-07-31',
      res,
    );
    expect(mockService.generateLaporanPenggunaanPDF).toHaveBeenCalledWith(
      '2024-07-01',
      '2024-07-31',
    );
    expect(res.set).toHaveBeenCalledWith(
      expect.objectContaining({
        'Content-Type': 'application/pdf',
      }),
    );
    expect(res.end).toHaveBeenCalledWith(expect.any(Buffer));
  });

  /**
   * Menguji pemanggilan service.getStokKritis pada fungsi getStokKritis.
   * @returns Promise<void>
   */
  it('should call service.getStokKritis', async () => {
    const mockService = {
      getStokKritis: jest.fn().mockResolvedValue([{ id: 1 }]),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarangController],
      providers: [{ provide: BarangService, useValue: mockService }],
    }).compile();
    const controller = module.get<BarangController>(BarangController);
    const result = await controller.getStokKritis();
    expect(mockService.getStokKritis).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1 }]);
  });

  /**
   * Menguji pemanggilan service.update pada fungsi update.
   * @returns Promise<void>
   */
  it('should call service.update', async () => {
    const mockService = { update: jest.fn().mockResolvedValue({ id: 1 }) };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarangController],
      providers: [{ provide: BarangService, useValue: mockService }],
    }).compile();
    const controller = module.get<BarangController>(BarangController);
    await controller.update(1, { nama_barang: 'Updated' } as any);
    expect(mockService.update).toHaveBeenCalledWith(1, {
      nama_barang: 'Updated',
    });
  });

  /**
   * Menguji pemanggilan service.softDelete pada fungsi softDelete.
   * @returns Promise<void>
   */
  it('should call service.softDelete', async () => {
    const mockService = { softDelete: jest.fn().mockResolvedValue({ id: 1 }) };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarangController],
      providers: [{ provide: BarangService, useValue: mockService }],
    }).compile();
    const controller = module.get<BarangController>(BarangController);
    await controller.softDelete(1);
    expect(mockService.softDelete).toHaveBeenCalledWith(1);
  });

  /**
   * Menguji pemanggilan service.findOne pada fungsi findOne.
   * @returns Promise<void>
   */
  it('should call service.findOne', async () => {
    const mockService = { findOne: jest.fn().mockResolvedValue({ id: 1 }) };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarangController],
      providers: [{ provide: BarangService, useValue: mockService }],
    }).compile();
    const controller = module.get<BarangController>(BarangController);
    await controller.findOne(1);
    expect(mockService.findOne).toHaveBeenCalledWith(1);
  });

  /**
   * Menguji penanganan error jika barang tidak ditemukan pada fungsi findOne.
   * @returns Promise<void>
   */
  it('should handle error if barang not found', async () => {
    const mockService = {
      findOne: jest.fn().mockRejectedValue(new Error('Barang tidak ditemukan')),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarangController],
      providers: [{ provide: BarangService, useValue: mockService }],
    }).compile();
    const controller = module.get<BarangController>(BarangController);
    await expect(controller.findOne(999)).rejects.toThrow(
      'Barang tidak ditemukan',
    );
  });
});
