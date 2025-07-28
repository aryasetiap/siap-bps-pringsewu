import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { execSync } from 'child_process';

describe('Permintaan E2E', () => {
  let app: INestApplication;
  let pegawaiToken: string;
  let adminToken: string;
  let createdPermintaanId: number;

  beforeAll(async () => {
    // Reset DB state
    execSync('npm run seed', { stdio: 'inherit' });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login sebagai pegawai
    const pegawaiRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'budi', password: 'budi123' });
    pegawaiToken = pegawaiRes.body.access_token;

    // Login sebagai admin
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
          { id_barang: 1, jumlah: 2 }, // Kertas A4 80gsm
          { id_barang: 2, jumlah: 1 }, // Spidol Whiteboard
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
    // Login sebagai pegawai lain
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
        items: [
          { id_barang: 5, jumlah: 10 }, // Pulpen Biru, stok hanya 1
        ],
        catatan: 'Test stok kurang',
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Stok barang/);
  });
});
