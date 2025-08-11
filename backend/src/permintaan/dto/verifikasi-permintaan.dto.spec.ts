/**
 * File ini berisi pengujian validasi untuk VerifikasiPermintaanDto pada aplikasi SIAP.
 * Pengujian dilakukan untuk memastikan proses verifikasi permintaan barang berjalan sesuai aturan bisnis.
 * DTO ini digunakan dalam proses verifikasi permintaan barang oleh petugas, termasuk validasi keputusan dan jumlah barang yang disetujui.
 */

import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { VerifikasiPermintaanDto } from './verifikasi-permintaan.dto';

/**
 * Kumpulan pengujian validasi untuk VerifikasiPermintaanDto.
 * Setiap pengujian memastikan bahwa DTO memvalidasi data sesuai aturan bisnis SIAP terkait permintaan dan verifikasi barang.
 */
describe('VerifikasiPermintaanDto Validation', () => {
  /**
   * Fungsi ini menguji validasi ketika nilai keputusan tidak sesuai dengan opsi yang diizinkan.
   *
   * Parameter:
   * - Tidak ada parameter.
   *
   * Return:
   * - Promise<void>: Melakukan assertion terhadap hasil validasi.
   */
  it('should fail if keputusan is invalid', async () => {
    const dto = plainToInstance(VerifikasiPermintaanDto, {
      keputusan: 'invalid', // Nilai keputusan tidak sesuai aturan bisnis
      items: [],
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  /**
   * Fungsi ini menguji validasi ketika jumlah_disetujui pada item bernilai negatif.
   * Hal ini tidak diperbolehkan dalam proses verifikasi permintaan barang.
   *
   * Parameter:
   * - Tidak ada parameter.
   *
   * Return:
   * - Promise<void>: Melakukan assertion terhadap hasil validasi.
   */
  it('should fail if jumlah_disetujui is negative', async () => {
    const dto = plainToInstance(VerifikasiPermintaanDto, {
      keputusan: 'setuju',
      items: [{ id_detail: 1, jumlah_disetujui: -1 }], // Jumlah disetujui negatif
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  /**
   * Fungsi ini menguji validasi ketika daftar items pada permintaan barang kosong.
   * Dalam bisnis proses SIAP, permintaan harus memiliki minimal satu item.
   *
   * Parameter:
   * - Tidak ada parameter.
   *
   * Return:
   * - Promise<void>: Melakukan assertion terhadap hasil validasi.
   */
  it('should fail if items is empty', async () => {
    const dto = plainToInstance(VerifikasiPermintaanDto, {
      keputusan: 'setuju',
      items: [], // Daftar item kosong
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  /**
   * Fungsi ini menguji validasi ketika keputusan verifikasi tidak diisi.
   * Keputusan wajib diisi untuk melanjutkan proses verifikasi permintaan barang.
   *
   * Parameter:
   * - Tidak ada parameter.
   *
   * Return:
   * - Promise<void>: Melakukan assertion terhadap hasil validasi.
   */
  it('should fail if keputusan is empty', async () => {
    const dto = plainToInstance(VerifikasiPermintaanDto, {
      items: [{ id_detail: 1, jumlah_disetujui: 1 }],
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
