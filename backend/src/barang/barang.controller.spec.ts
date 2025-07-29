import { Test, TestingModule } from '@nestjs/testing';
import { BarangController } from './barang.controller';
import { BarangService } from './barang.service';
import { Response } from 'express';

describe('BarangController', () => {
  let controller: BarangController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarangController],
      providers: [
        {
          provide: BarangService,
          useValue: {}, // mock methods if needed
        },
      ],
    }).compile();

    controller = module.get<BarangController>(BarangController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

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
});
