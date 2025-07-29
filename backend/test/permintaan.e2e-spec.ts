import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { execSync } from 'child_process';

/**
 * Pengujian End-to-End untuk fitur Permintaan Barang.
 * Meliputi pengajuan, verifikasi, akses riwayat, dan dashboard statistik permintaan.
 */
describe('Permintaan E2E', () => {
  let app: INestApplication;
  let pegawaiToken: string;
  let adminToken: string;
  let createdPermintaanId: number;

  /**
   * Inisialisasi aplikasi dan autentikasi pengguna sebelum seluruh pengujian dijalankan.
   * Melakukan seed database dan login sebagai pegawai serta admin.
   * @returns {Promise<void>}
   */
  beforeAll(async () => {
    execSync('npm run seed', { stdio: 'inherit' });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const pegawaiRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'budi', password: 'budi123' });
    pegawaiToken = pegawaiRes.body.access_token;

    const adminRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    adminToken = adminRes.body.access_token;
  });

  /**
   * Menutup aplikasi setelah seluruh pengujian selesai.
   * @returns {Promise<void>}
   */
  afterAll(async () => {
    await app.close();
  });

  /**
   * Menguji apakah pegawai dapat mengajukan permintaan barang.
   * @returns {Promise<void>}
   */
  it('Pegawai dapat mengajukan permintaan barang', async () => {
    const res = await request(app.getHttpServer())
      .post('/permintaan')
      .set('Authorization', `Bearer ${pegawaiToken}`)
      .send({
        items: [
          { id_barang: 1, jumlah: 2 },
          { id_barang: 2, jumlah: 1 },
        ],
        catatan: 'Untuk kebutuhan rapat',
      });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('Menunggu');
    expect(res.body.items.length).toBe(2);
    createdPermintaanId = res.body.id;
  });

  /**
   * Menguji apakah pegawai dapat melihat riwayat permintaan miliknya.
   * @returns {Promise<void>}
   */
  it('Pegawai dapat melihat riwayat permintaan miliknya', async () => {
    const res = await request(app.getHttpServer())
      .get('/permintaan/riwayat')
      .set('Authorization', `Bearer ${pegawaiToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('items');
  });

  /**
   * Menguji apakah pegawai dapat melihat detail permintaan miliknya.
   * @returns {Promise<void>}
   */
  it('Pegawai dapat melihat detail permintaan miliknya', async () => {
    const res = await request(app.getHttpServer())
      .get(`/permintaan/${createdPermintaanId}`)
      .set('Authorization', `Bearer ${pegawaiToken}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdPermintaanId);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  /**
   * Menguji bahwa pegawai tidak dapat melihat permintaan milik user lain.
   * @returns {Promise<void>}
   */
  it('Pegawai TIDAK BISA melihat permintaan milik user lain', async () => {
    const pegawaiRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'siti', password: 'siti123' });
    const tokenSiti = pegawaiRes.body.access_token;

    const res = await request(app.getHttpServer())
      .get(`/permintaan/${createdPermintaanId}`)
      .set('Authorization', `Bearer ${tokenSiti}`);
    expect(res.status).toBe(403);
  });

  /**
   * Menguji apakah admin dapat melihat daftar permintaan masuk dengan status 'Menunggu'.
   * @returns {Promise<void>}
   */
  it('Admin dapat melihat daftar permintaan masuk (Menunggu)', async () => {
    const res = await request(app.getHttpServer())
      .get('/permintaan/masuk')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('status', 'Menunggu');
  });

  /**
   * Menguji bahwa non-admin tidak dapat mengakses daftar permintaan masuk.
   * @returns {Promise<void>}
   */
  it('Non-admin TIDAK BISA akses daftar permintaan masuk', async () => {
    const res = await request(app.getHttpServer())
      .get('/permintaan/masuk')
      .set('Authorization', `Bearer ${pegawaiToken}`);
    expect(res.status).toBe(403);
  });

  /**
   * Menguji bahwa permintaan barang dengan stok kurang akan gagal.
   * @returns {Promise<void>}
   */
  it('Tidak bisa mengajukan permintaan barang dengan stok kurang', async () => {
    const res = await request(app.getHttpServer())
      .post('/permintaan')
      .set('Authorization', `Bearer ${pegawaiToken}`)
      .send({
        items: [{ id_barang: 5, jumlah: 10 }],
        catatan: 'Test stok kurang',
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Stok barang/);
  });

  /**
   * Menguji apakah admin dapat memverifikasi permintaan dan menyetujui seluruh item.
   * @returns {Promise<void>}
   */
  it('Admin dapat memverifikasi permintaan (setuju semua)', async () => {
    const detailRes = await request(app.getHttpServer())
      .get(`/permintaan/${createdPermintaanId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(detailRes.status).toBe(200);
    const items = detailRes.body.items.map((item) => ({
      id_detail: item.id,
      jumlah_disetujui: item.jumlah_diminta,
    }));

    const res = await request(app.getHttpServer())
      .patch(`/permintaan/${createdPermintaanId}/verifikasi`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        keputusan: 'setuju',
        items,
        catatan_verifikasi: 'Disetujui penuh oleh admin',
      });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Disetujui');
    expect(res.body.catatan).toBe('Disetujui penuh oleh admin');
  });

  /**
   * Menguji endpoint statistik dashboard permintaan.
   * @returns {Promise<void>}
   */
  it('GET /permintaan/dashboard/statistik returns dashboard stats', async () => {
    const res = await request(app.getHttpServer())
      .get('/permintaan/dashboard/statistik')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalBarang');
    expect(res.body).toHaveProperty('totalPermintaanTertunda');
    expect(res.body).toHaveProperty('totalBarangKritis');
  });

  /**
   * Menguji endpoint tren permintaan pada dashboard.
   * @returns {Promise<void>}
   */
  it('GET /permintaan/dashboard/tren-permintaan returns trend data', async () => {
    const res = await request(app.getHttpServer())
      .get('/permintaan/dashboard/tren-permintaan')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('bulan');
    expect(res.body[0]).toHaveProperty('jumlah');
  });

  /**
   * Menguji endpoint untuk mengunduh PDF permintaan.
   * @returns {Promise<void>}
   */
  it('GET /permintaan/:id/pdf returns PDF', async () => {
    const res = await request(app.getHttpServer())
      .get(`/permintaan/${createdPermintaanId}/pdf`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.header['content-type']).toBe('application/pdf');
    expect(res.header['content-disposition']).toMatch(/attachment/);
    expect(res.body).toBeInstanceOf(Buffer);
  });
});
