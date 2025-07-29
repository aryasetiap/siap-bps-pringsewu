import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { VerifikasiPermintaanDto } from './verifikasi-permintaan.dto';

describe('VerifikasiPermintaanDto Validation', () => {
  it('should fail if keputusan is invalid', async () => {
    const dto = plainToInstance(VerifikasiPermintaanDto, {
      keputusan: 'invalid',
      items: [],
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail if jumlah_disetujui is negative', async () => {
    const dto = plainToInstance(VerifikasiPermintaanDto, {
      keputusan: 'setuju',
      items: [{ id_detail: 1, jumlah_disetujui: -1 }],
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail if items is empty', async () => {
    const dto = plainToInstance(VerifikasiPermintaanDto, {
      keputusan: 'setuju',
      items: [],
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail if keputusan is empty', async () => {
    const dto = plainToInstance(VerifikasiPermintaanDto, {
      items: [{ id_detail: 1, jumlah_disetujui: 1 }],
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
