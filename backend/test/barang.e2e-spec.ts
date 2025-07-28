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

  afterAll(async () => {
    await app.close();
  });
});
