import { Test, TestingModule } from '@nestjs/testing';
import { PermintaanService } from './permintaan.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permintaan } from '../entities/permintaan.entity';
import { DetailPermintaan } from '../entities/detail_permintaan.entity';
import { Barang } from '../entities/barang.entity';

describe('PermintaanService', () => {
  let service: PermintaanService;
  let barangRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermintaanService,
        { provide: getRepositoryToken(Permintaan), useValue: {} },
        { provide: getRepositoryToken(DetailPermintaan), useValue: {} },
        {
          provide: getRepositoryToken(Barang),
          useValue: {
            findByIds: jest.fn(),
          },
        },
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
    barangRepo.findByIds.mockResolvedValue(barangList);

    await expect(service.create(dto, 1)).rejects.toThrow(
      /Stok barang "Barang B" tidak mencukupi/,
    );
  });
});
