import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('User CRUD (e2e)', () => {
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

    // Hapus user test jika sudah ada
    await request(app.getHttpServer())
      .delete('/user')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'usertest' }); // Pastikan ada endpoint untuk bulk delete atau gunakan query langsung ke DB jika perlu
  });

  it('POST /user (create)', async () => {
    const uniqueUsername = 'usertest_' + Date.now();
    const res = await request(app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nama: 'User Test',
        username: uniqueUsername,
        password: 'test123',
        role: 'pegawai',
      });
    expect(res.status).toBe(201);
    expect(res.body.username).toBe(uniqueUsername);
    createdId = res.body.id;
  });

  it('PATCH /user/:id (update)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/user/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nama: 'User Test Updated' });
    expect(res.status).toBe(200);
    expect(res.body.nama).toBe('User Test Updated');
  });

  it('DELETE /user/:id (soft delete)', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/user/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.status_aktif).toBe(false);
  });

  it('GET /user (find all)', async () => {
    const res = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /user/:id (find one)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/user/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdId);
  });

  it('GET /user/:id (not found)', async () => {
    const res = await request(app.getHttpServer())
      .get('/user/999999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/User tidak ditemukan/i);
  });

  it('PATCH /user/:id (not found)', async () => {
    const res = await request(app.getHttpServer())
      .patch('/user/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({ nama: 'X' });
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/User tidak ditemukan/i);
  });

  it('DELETE /user/:id (not found)', async () => {
    const res = await request(app.getHttpServer())
      .delete('/user/999999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/User tidak ditemukan/i);
  });

  afterAll(async () => {
    await app.close();
  });
});
