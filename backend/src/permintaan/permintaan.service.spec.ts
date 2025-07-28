import { Test, TestingModule } from '@nestjs/testing';
import { PermintaanService } from './permintaan.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permintaan } from '../entities/permintaan.entity';
import { DetailPermintaan } from '../entities/detail_permintaan.entity';
import { Barang } from '../entities/barang.entity';
import { DataSource } from 'typeorm';

describe('PermintaanService', () => {
  let service: PermintaanService;
  let barangRepo: any;

  beforeEach(async () => {
    const mockDataSource = {
      transaction: jest.fn().mockImplementation(async (transactionalWork) => {
        const mockManager = {
          save: jest.fn().mockImplementation(async (entity) => ({
            ...entity,
            id: entity.id || Date.now(),
            tanggal_permintaan: new Date(),
          })),
        };
        return transactionalWork(mockManager);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermintaanService,
        {
          provide: getRepositoryToken(Permintaan),
          useValue: { create: jest.fn((data) => data), save: jest.fn() },
        },
        {
          provide: getRepositoryToken(DetailPermintaan),
          useValue: { create: jest.fn((data) => data), save: jest.fn() },
        },
        {
          provide: getRepositoryToken(Barang),
          // ================== PERBAIKAN 1 ==================
          // Samakan nama fungsi di mock dengan yang dipanggil di service
          useValue: { findByIds: jest.fn() },
        },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<PermintaanService>(PermintaanService);
    barangRepo = module.get(getRepositoryToken(Barang));
  });

  it('should throw error if any item stock is insufficient', async () => {
    const dto = {
      items: [
        { id_barang: 1, jumlah: 10 },
        { id_barang: 2, jumlah: 20 },
      ],
      catatan: 'Test',
    };
    const barangList = [
      { id: 1, nama_barang: 'Barang A', stok: 15 },
      { id: 2, nama_barang: 'Barang B', stok: 5 }, // stok kurang
    ];
    // ================== PERBAIKAN 2 ==================
    // Gunakan mock 'findByIds' yang sudah benar
    barangRepo.findByIds.mockResolvedValue(barangList);

    await expect(service.create(dto, 1)).rejects.toThrow(
      /Stok barang "Barang B" tidak mencukupi/,
    );
  });

  it('should save permintaan and detail_permintaan atomically', async () => {
    const dto = {
      items: [
        { id_barang: 1, jumlah: 2 },
        { id_barang: 2, jumlah: 3 },
      ],
      catatan: 'Test simpan',
    };
    const barangList = [
      { id: 1, nama_barang: 'Barang A', stok: 10 },
      { id: 2, nama_barang: 'Barang B', stok: 10 },
    ];
    // ================== PERBAIKAN 3 ==================
    // Gunakan mock 'findByIds' yang sudah benar
    barangRepo.findByIds.mockResolvedValue(barangList);

    const result = await service.create(dto, 1);

    expect(result).toHaveProperty('id');
    expect(result.catatan).toBe(dto.catatan);
  });
});
