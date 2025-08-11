import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Permintaan E2E', () => {
  let app: INestApplication;
  let pegawaiToken: string;
  let adminToken: string;
  let createdPermintaanId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login pegawai
    const pegawaiRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'budi', password: 'budi123' });
    pegawaiToken = pegawaiRes.body.access_token;

    // Login admin
    const adminRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    adminToken = adminRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

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

  it('Pegawai dapat melihat riwayat permintaan miliknya', async () => {
    const res = await request(app.getHttpServer())
      .get('/permintaan/riwayat')
      .set('Authorization', `Bearer ${pegawaiToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('items');
  });

  it('Pegawai dapat melihat detail permintaan miliknya', async () => {
    const res = await request(app.getHttpServer())
      .get(`/permintaan/${createdPermintaanId}`)
      .set('Authorization', `Bearer ${pegawaiToken}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdPermintaanId);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

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

  it('Admin dapat melihat daftar permintaan masuk (Menunggu)', async () => {
    const res = await request(app.getHttpServer())
      .get('/permintaan/masuk')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('status', 'Menunggu');
  });

  it('Non-admin TIDAK BISA akses daftar permintaan masuk', async () => {
    const res = await request(app.getHttpServer())
      .get('/permintaan/masuk')
      .set('Authorization', `Bearer ${pegawaiToken}`);
    expect(res.status).toBe(403);
  });

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

  it('Admin dapat memverifikasi permintaan (sebagian)', async () => {
    const detailRes = await request(app.getHttpServer())
      .get(`/permintaan/${createdPermintaanId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    const items = detailRes.body.items.map((item) => ({
      id_detail: item.id,
      jumlah_disetujui: Math.max(1, item.jumlah_diminta - 1),
    }));

    const res = await request(app.getHttpServer())
      .patch(`/permintaan/${createdPermintaanId}/verifikasi`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        keputusan: 'sebagian',
        items,
        catatan_verifikasi: 'Disetujui sebagian',
      });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Disetujui Sebagian');
  });

  it('Admin dapat memverifikasi permintaan (tolak)', async () => {
    const detailRes = await request(app.getHttpServer())
      .get(`/permintaan/${createdPermintaanId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    const items = detailRes.body.items.map((item) => ({
      id_detail: item.id,
      jumlah_disetujui: 0,
    }));

    const res = await request(app.getHttpServer())
      .patch(`/permintaan/${createdPermintaanId}/verifikasi`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        keputusan: 'tolak',
        items,
        catatan_verifikasi: 'Ditolak',
      });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Ditolak');
  });

  it('Verifikasi gagal jika jumlah_disetujui > jumlah_diminta', async () => {
    const detailRes = await request(app.getHttpServer())
      .get(`/permintaan/${createdPermintaanId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    const item = detailRes.body.items[0];
    const res = await request(app.getHttpServer())
      .patch(`/permintaan/${createdPermintaanId}/verifikasi`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        keputusan: 'setuju',
        items: [
          { id_detail: item.id, jumlah_disetujui: item.jumlah_diminta + 1 },
        ],
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/jumlah diminta/);
  });

  it('Verifikasi gagal jika jumlah_disetujui > stok barang', async () => {
    // Asumsikan stok barang sudah habis setelah verifikasi sebelumnya
    const detailRes = await request(app.getHttpServer())
      .get(`/permintaan/${createdPermintaanId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    const item = detailRes.body.items[0];
    const res = await request(app.getHttpServer())
      .patch(`/permintaan/${createdPermintaanId}/verifikasi`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        keputusan: 'setuju',
        items: [{ id_detail: item.id, jumlah_disetujui: 999 }],
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/stok/i);
  });

  it('Verifikasi gagal jika permintaan sudah diverifikasi', async () => {
    // Verifikasi permintaan yang sudah diverifikasi
    const detailRes = await request(app.getHttpServer())
      .get(`/permintaan/${createdPermintaanId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    const items = detailRes.body.items.map((item) => ({
      id_detail: item.id,
      jumlah_disetujui: item.jumlah_diminta,
    }));

    // Verifikasi pertama
    await request(app.getHttpServer())
      .patch(`/permintaan/${createdPermintaanId}/verifikasi`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        keputusan: 'setuju',
        items,
      });

    // Verifikasi kedua (harus gagal)
    const res = await request(app.getHttpServer())
      .patch(`/permintaan/${createdPermintaanId}/verifikasi`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        keputusan: 'setuju',
        items,
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/sudah diverifikasi/);
  });

  it('GET /permintaan/:id/pdf forbidden untuk pegawai bukan pemilik', async () => {
    const pegawaiRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'siti', password: 'siti123' });
    const tokenSiti = pegawaiRes.body.access_token;

    const res = await request(app.getHttpServer())
      .get(`/permintaan/${createdPermintaanId}/pdf`)
      .set('Authorization', `Bearer ${tokenSiti}`);
    expect(res.status).toBe(403);
  });

  it('GET /permintaan/:id not found', async () => {
    const res = await request(app.getHttpServer())
      .get('/permintaan/999999')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });

  it('GET /permintaan/dashboard/statistik returns dashboard stats', async () => {
    const res = await request(app.getHttpServer())
      .get('/permintaan/dashboard/statistik')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalBarang');
    expect(res.body).toHaveProperty('totalPermintaanTertunda');
    expect(res.body).toHaveProperty('totalBarangKritis');
    expect(res.body).toHaveProperty('totalUser');
  });

  it('GET /permintaan/dashboard/tren-permintaan returns trend data', async () => {
    const res = await request(app.getHttpServer())
      .get('/permintaan/dashboard/tren-permintaan')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('bulan');
    expect(res.body[0]).toHaveProperty('jumlah');
  });

  it('GET /permintaan/:id/pdf returns PDF for admin', async () => {
    const res = await request(app.getHttpServer())
      .get(`/permintaan/${createdPermintaanId}/pdf`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.header['content-type']).toBe('application/pdf');
    expect(res.header['content-disposition']).toMatch(/attachment/);
    expect(res.body).toBeInstanceOf(Buffer);
  });

  it('GET /permintaan/:id/pdf returns PDF for pegawai pemilik', async () => {
    const res = await request(app.getHttpServer())
      .get(`/permintaan/${createdPermintaanId}/pdf`)
      .set('Authorization', `Bearer ${pegawaiToken}`);
    expect(res.status).toBe(200);
    expect(res.header['content-type']).toBe('application/pdf');
    expect(res.header['content-disposition']).toMatch(/attachment/);
    expect(res.body).toBeInstanceOf(Buffer);
  });

  it('GET /permintaan/all returns paginated data', async () => {
    const res = await request(app.getHttpServer())
      .get('/permintaan/all?status=Menunggu&page=1&limit=10')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('page');
    expect(res.body).toHaveProperty('limit');
  });
});
