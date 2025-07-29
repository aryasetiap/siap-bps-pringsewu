import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

/**
 * Pengujian end-to-end untuk fitur CRUD Barang.
 * Meliputi pembuatan, pembaruan, penambahan stok, penghapusan, pencarian, validasi, dan laporan.
 */
describe('Barang CRUD (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let createdId: number;

  /**
   * Inisialisasi aplikasi dan autentikasi sebelum seluruh pengujian dijalankan.
   * @returns {Promise<void>}
   */
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    token = res.body.access_token;
  });

  /**
   * Menguji endpoint pembuatan barang baru.
   * @returns {Promise<void>}
   */
  it('POST /barang (create)', async () => {
    const uniqueKode = 'BRG' + Date.now();
    const res = await request(app.getHttpServer())
      .post('/barang')
      .set('Authorization', `Bearer ${token}`)
      .send({
        kode_barang: uniqueKode,
        nama_barang: 'Barang Test',
        satuan: 'pcs',
      });
    if (res.status !== 201) {
      console.error('POST /barang failed:', res.body);
    }
    expect(res.status).toBe(201);
    expect(res.body.kode_barang).toBe(uniqueKode);
    createdId = res.body.id;
  });

  /**
   * Menguji endpoint pembaruan data barang berdasarkan ID.
   * @returns {Promise<void>}
   */
  it('PATCH /barang/:id (update)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/barang/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nama_barang: 'Barang Updated' });
    expect(res.status).toBe(200);
    expect(res.body.nama_barang).toBe('Barang Updated');
  });

  /**
   * Menguji endpoint penambahan stok barang berdasarkan ID.
   * @returns {Promise<void>}
   */
  it('PATCH /barang/:id/add-stok (add stok)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/barang/${createdId}/add-stok`)
      .set('Authorization', `Bearer ${token}`)
      .send({ jumlah: 10 });
    expect(res.status).toBe(200);
    expect(res.body.stok).toBeGreaterThanOrEqual(10);
  });

  /**
   * Menguji endpoint penghapusan (soft delete) barang berdasarkan ID.
   * @returns {Promise<void>}
   */
  it('DELETE /barang/:id (soft delete)', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/barang/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.status_aktif).toBe(false);
  });

  /**
   * Menguji endpoint pengambilan seluruh data barang.
   * @returns {Promise<void>}
   */
  it('GET /barang (find all)', async () => {
    const res = await request(app.getHttpServer())
      .get('/barang')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  /**
   * Menguji endpoint pengambilan data barang berdasarkan ID.
   * @returns {Promise<void>}
   */
  it('GET /barang/:id (find one)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/barang/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdId);
  });

  /**
   * Menguji validasi kode_barang yang tidak valid saat pembuatan barang.
   * @returns {Promise<void>}
   */
  it('POST /barang (invalid kode_barang)', async () => {
    const uniqueKode = 'BRG' + Date.now() + '!';
    const res = await request(app.getHttpServer())
      .post('/barang')
      .set('Authorization', `Bearer ${token}`)
      .send({
        kode_barang: uniqueKode,
        nama_barang: 'Barang Test',
        satuan: 'pcs',
      });
    expect(res.status).toBe(400);
    const msg = Array.isArray(res.body.message)
      ? res.body.message.join(' ')
      : res.body.message;
    expect(msg).toContain('Kode hanya boleh huruf, angka, dan strip');
  });

  /**
   * Menguji validasi stok negatif saat pembuatan barang.
   * @returns {Promise<void>}
   */
  it('POST /barang (negative stok)', async () => {
    const uniqueKode = 'BRG' + Date.now();
    const res = await request(app.getHttpServer())
      .post('/barang')
      .set('Authorization', `Bearer ${token}`)
      .send({
        kode_barang: uniqueKode,
        nama_barang: 'Barang Test',
        satuan: 'pcs',
        stok: -10,
      });
    expect(res.status).toBe(400);
    const msg = Array.isArray(res.body.message)
      ? res.body.message.join(' ')
      : res.body.message;
    expect(msg).toContain('must not be less than 0');
  });

  /**
   * Menguji pencarian barang berdasarkan query string pada nama_barang.
   * @returns {Promise<void>}
   */
  it('GET /barang?q=Kertas', async () => {
    const res = await request(app.getHttpServer())
      .get('/barang?q=Kertas')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.some((b) => b.nama_barang.includes('Kertas'))).toBe(true);
  });

  /**
   * Menguji filter barang berdasarkan status_aktif.
   * @returns {Promise<void>}
   */
  it('GET /barang?status_aktif=true', async () => {
    const res = await request(app.getHttpServer())
      .get('/barang?status_aktif=true')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.every((b) => b.status_aktif === true)).toBe(true);
  });

  /**
   * Menguji endpoint pengambilan barang dengan stok kritis.
   * @returns {Promise<void>}
   */
  it('GET /barang/stok-kritis returns kritis items', async () => {
    const res = await request(app.getHttpServer())
      .get('/barang/stok-kritis')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      res.body.forEach((item) => {
        expect(item.stok).toBeLessThanOrEqual(item.ambang_batas_kritis);
        expect(item.status_aktif).toBe(true);
      });
    }
  });

  /**
   * Menguji endpoint laporan penggunaan barang dalam format PDF.
   * @returns {Promise<void>}
   */
  it('GET /barang/laporan-penggunaan/pdf returns PDF', async () => {
    const res = await request(app.getHttpServer())
      .get('/barang/laporan-penggunaan/pdf?start=2024-07-01&end=2024-07-31')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.header['content-type']).toBe('application/pdf');
    expect(res.header['content-disposition']).toMatch(/attachment/);
    expect(res.body).toBeInstanceOf(Buffer);
  });

  /**
   * Menutup aplikasi setelah seluruh pengujian selesai.
   * @returns {Promise<void>}
   */
  afterAll(async () => {
    await app.close();
  });
});
