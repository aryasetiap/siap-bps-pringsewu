import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Permintaan (e2e)', () => {
  let app: INestApplication;
  let pegawaiToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login admin
    const adminRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    adminToken = adminRes.body.access_token;

    // Login sebagai pegawai (pastikan user pegawai ada di seeder)
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'pegawai1', password: 'pegawai123' });
    pegawaiToken = loginRes.body.access_token;
  });

  it('POST /permintaan (multi-item)', async () => {
    // Ambil barang aktif pakai token admin
    const barangRes = await request(app.getHttpServer())
      .get('/barang?status_aktif=true')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(barangRes.status).toBe(200);
    expect(Array.isArray(barangRes.body)).toBe(true);
    expect(barangRes.body.length).toBeGreaterThanOrEqual(2);

    const barang = barangRes.body;

    const res = await request(app.getHttpServer())
      .post('/permintaan')
      .set('Authorization', `Bearer ${pegawaiToken}`)
      .send({
        items: [
          { id_barang: barang[0].id, jumlah: 2 },
          { id_barang: barang[1].id, jumlah: 5 },
        ],
        catatan: 'Untuk kebutuhan survei',
      });
    expect(res.status).toBe(201);
    expect(res.body.items.length).toBe(2);
  });

  it('POST /permintaan (should fail if stock is insufficient)', async () => {
    // Ambil barang aktif
    const barangRes = await request(app.getHttpServer())
      .get('/barang?status_aktif=true')
      .set('Authorization', `Bearer ${adminToken}`);
    const barang = barangRes.body[0];
    // Set jumlah lebih dari stok
    const res = await request(app.getHttpServer())
      .post('/permintaan')
      .set('Authorization', `Bearer ${pegawaiToken}`)
      .send({
        items: [{ id_barang: barang.id, jumlah: barang.stok + 100 }],
        catatan: 'Test stok tidak cukup',
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/tidak mencukupi/i);
  });

  afterAll(async () => {
    await app.close();
  });
});
