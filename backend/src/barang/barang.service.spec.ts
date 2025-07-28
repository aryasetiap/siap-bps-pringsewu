import { Test, TestingModule } from '@nestjs/testing';
import { BarangService } from './barang.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Barang } from '../entities/barang.entity';
import { Repository } from 'typeorm';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BarangService,
        {
          provide: getRepositoryToken(Barang),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BarangService>(BarangService);
    repo = module.get<Repository<Barang>>(getRepositoryToken(Barang));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

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

  it('should throw BadRequestException if kode_barang exists', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(mockBarang);
    const dto = { kode_barang: 'BRG001', nama_barang: 'X', satuan: 'rim' };
    await expect(service.create(dto as any)).rejects.toThrow(
      'Kode barang sudah terdaftar',
    );
  });

  it('should update barang', async () => {
    const updated = { ...mockBarang, nama_barang: 'Updated' };
    (repo.findOne as jest.Mock).mockResolvedValue(mockBarang);
    (repo.save as jest.Mock).mockResolvedValue(updated);

    const dto = { nama_barang: 'Updated' };
    const result = await service.update(1, dto as any);
    expect(result.nama_barang).toBe('Updated');
    expect(repo.save).toHaveBeenCalled();
  });

  it('should soft delete barang', async () => {
    const softDeleted = { ...mockBarang, status_aktif: false };
    (repo.findOne as jest.Mock).mockResolvedValue(mockBarang);
    (repo.save as jest.Mock).mockResolvedValue(softDeleted);

    const result = await service.softDelete(1);
    expect(result.status_aktif).toBe(false);
  });

  it('should find all barang', async () => {
    (repo.find as jest.Mock).mockResolvedValue([mockBarang]);
    const result = await service.findAll();
    expect(repo.find).toHaveBeenCalled();
    expect(result).toEqual([mockBarang]);
  });

  it('should find one barang by id', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(mockBarang);
    const result = await service.findOne(1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mockBarang);
  });

  it('should throw NotFoundException if barang not found', async () => {
    (repo.findOne as jest.Mock).mockResolvedValue(undefined);
    await expect(service.findOne(999)).rejects.toThrow(
      'Barang tidak ditemukan',
    );
  });
});
