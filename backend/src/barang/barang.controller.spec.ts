import { Test, TestingModule } from '@nestjs/testing';
import { BarangController } from './barang.controller';
import { BarangService } from './barang.service';

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
});
