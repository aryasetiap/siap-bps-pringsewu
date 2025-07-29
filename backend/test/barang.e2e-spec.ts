import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Barang CRUD (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let createdId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login as admin
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    token = res.body.access_token;
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
      });
    if (res.status !== 201) {
      console.error('POST /barang failed:', res.body);
    }
    expect(res.status).toBe(201);
    expect(res.body.kode_barang).toBe(uniqueKode);
    createdId = res.body.id;
  });

  it('PATCH /barang/:id (update)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/barang/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nama_barang: 'Barang Updated' });
    expect(res.status).toBe(200);
    expect(res.body.nama_barang).toBe('Barang Updated');
  });

  it('PATCH /barang/:id/add-stok (add stok)', async () => {
    // Pastikan barang sudah dibuat di test sebelumnya
    const res = await request(app.getHttpServer())
      .patch(`/barang/${createdId}/add-stok`)
      .set('Authorization', `Bearer ${token}`)
      .send({ jumlah: 10 });
    expect(res.status).toBe(200);
    expect(res.body.stok).toBeGreaterThanOrEqual(10);
  });

  it('DELETE /barang/:id (soft delete)', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/barang/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.status_aktif).toBe(false);
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

  it('POST /barang (invalid kode_barang)', async () => {
    const uniqueKode = 'BRG' + Date.now() + '!';
    const res = await request(app.getHttpServer())
      .post('/barang')
      .set('Authorization', `Bearer ${token}`)
      .send({
        kode_barang: uniqueKode, // selalu unik dan invalid
        nama_barang: 'Barang Test',
        satuan: 'pcs',
      });
    expect(res.status).toBe(400);
    const msg = Array.isArray(res.body.message)
      ? res.body.message.join(' ')
      : res.body.message;
    expect(msg).toContain('Kode hanya boleh huruf, angka, dan strip');
  });

  it('POST /barang (negative stok)', async () => {
    const uniqueKode = 'BRG' + Date.now();
    const res = await request(app.getHttpServer())
      .post('/barang')
      .set('Authorization', `Bearer ${token}`)
      .send({
        kode_barang: uniqueKode, // selalu unik
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

  it('GET /barang?q=Kertas', async () => {
    const res = await request(app.getHttpServer())
      .get('/barang?q=Kertas')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.some((b) => b.nama_barang.includes('Kertas'))).toBe(true);
  });

  it('GET /barang?status_aktif=true', async () => {
    const res = await request(app.getHttpServer())
      .get('/barang?status_aktif=true')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.every((b) => b.status_aktif === true)).toBe(true);
  });

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

  afterAll(async () => {
    await app.close();
  });
});
