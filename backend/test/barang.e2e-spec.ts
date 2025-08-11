import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Barang E2E', () => {
  let app: INestApplication;
  let token: string;
  let createdId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login sebagai admin
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    token = res.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /barang (create)', async () => {
    const uniqueKode = 'BRG' + Date.now();
    const res = await request(app.getHttpServer())
      .post('/barang')
      .set('Authorization', `Bearer ${token}`)
      .send({
        kode_barang: uniqueKode,
        nama_barang: 'Barang Test',
        satuan: 'pcs',
        stok: 10,
        ambang_batas_kritis: 5,
      });
    expect(res.status).toBe(201);
    expect(res.body.kode_barang).toBe(uniqueKode);
    createdId = res.body.id;
  });

  it('POST /barang (create) should fail if kode_barang exists', async () => {
    const res = await request(app.getHttpServer())
      .post('/barang')
      .set('Authorization', `Bearer ${token}`)
      .send({
        kode_barang: 'BRG001', // kode_barang yang sudah ada
        nama_barang: 'Barang Duplikat',
        satuan: 'pcs',
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Kode barang sudah terdaftar/);
  });

  it('GET /barang (find all)', async () => {
    const res = await request(app.getHttpServer())
      .get('/barang')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /barang/:id (find one)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/barang/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdId);
  });

  it('PATCH /barang/:id (update)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/barang/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nama_barang: 'Barang Updated' });
    expect(res.status).toBe(200);
    expect(res.body.nama_barang).toBe('Barang Updated');
  });

  it('PATCH /barang/:id (update) should fail if stok is negative', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/barang/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ stok: -10 });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Stok tidak boleh negatif/);
  });

  it('PATCH /barang/:id/add-stok (add stok)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/barang/${createdId}/add-stok`)
      .set('Authorization', `Bearer ${token}`)
      .send({ jumlah: 10 });
    expect(res.status).toBe(200);
    expect(res.body.stok).toBeGreaterThanOrEqual(10);
  });

  it('PATCH /barang/:id/add-stok should fail if jumlah < 1', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/barang/${createdId}/add-stok`)
      .set('Authorization', `Bearer ${token}`)
      .send({ jumlah: 0 });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Jumlah penambahan stok minimal 1/);
  });

  it('PATCH /barang/:id/add-stok should fail if barang not active', async () => {
    // Nonaktifkan barang dulu
    await request(app.getHttpServer())
      .delete(`/barang/${createdId}`)
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app.getHttpServer())
      .patch(`/barang/${createdId}/add-stok`)
      .set('Authorization', `Bearer ${token}`)
      .send({ jumlah: 5 });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Barang tidak aktif/);
  });

  it('DELETE /barang/:id (soft delete)', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/barang/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.status_aktif).toBe(false);
  });

  it('GET /barang/available', async () => {
    const res = await request(app.getHttpServer())
      .get('/barang/available')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.every((b) => b.status_aktif === true)).toBe(true);
  });

  it('GET /barang/stok-kritis', async () => {
    const res = await request(app.getHttpServer())
      .get('/barang/stok-kritis')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /barang/dashboard/notifikasi-stok-kritis', async () => {
    const res = await request(app.getHttpServer())
      .get('/barang/dashboard/notifikasi-stok-kritis')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /barang/laporan-penggunaan?start=2024-07-01&end=2024-07-31', async () => {
    const res = await request(app.getHttpServer())
      .get('/barang/laporan-penggunaan?start=2024-07-01&end=2024-07-31')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /barang/laporan-penggunaan/pdf?start=2024-07-01&end=2024-07-31', async () => {
    const res = await request(app.getHttpServer())
      .get('/barang/laporan-penggunaan/pdf?start=2024-07-01&end=2024-07-31')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.header['content-type']).toBe('application/pdf');
    expect(res.header['content-disposition']).toMatch(/attachment/);
    expect(res.body).toBeInstanceOf(Buffer);
  });

  it('GET /barang/laporan-penggunaan should fail if start date format invalid', async () => {
    const res = await request(app.getHttpServer())
      .get('/barang/laporan-penggunaan?start=2024-7-01&end=2024-07-31')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Format tanggal harus YYYY-MM-DD/);
  });

  it('GET /barang/laporan-penggunaan should fail if start date > end date', async () => {
    const res = await request(app.getHttpServer())
      .get('/barang/laporan-penggunaan?start=2024-08-01&end=2024-07-31')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Tanggal mulai harus <= tanggal akhir/);
  });
});
