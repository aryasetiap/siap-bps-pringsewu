import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('User CRUD (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let createdUserId: number;
  const uniqueUsername = `usertest_${Date.now()}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const res = await request(app.getHttpServer()).post('/auth/login').send({
      username: 'admin',
      password: 'admin123',
    });
    token = res.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /user (create)', async () => {
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
    createdUserId = res.body.id;
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
      .get(`/user/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdUserId);
  });

  it('PATCH /user/:id (update)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/user/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nama: 'User Test Updated' });
    expect(res.status).toBe(200);
    expect(res.body.nama).toBe('User Test Updated');
  });

  it('DELETE /user/:id (soft delete)', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/user/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);

    const checkRes = await request(app.getHttpServer())
      .get(`/user/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(checkRes.body.status_aktif).toBe(false);
  });

  it('GET /user/profile (lihat profil)', async () => {
    const res = await request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('admin');
  });

  it('PATCH /user/profile (edit profil)', async () => {
    const res = await request(app.getHttpServer())
      .patch('/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ nama: 'Admin Diperbarui' });
    expect(res.status).toBe(200);
    expect(res.body.nama).toBe('Admin Diperbarui');
  });

  it('DELETE /user (soft delete by username)', async () => {
    const res = await request(app.getHttpServer())
      .delete('/user')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: uniqueUsername });
    expect(res.status).toBe(200);
    expect(res.body.status_aktif).toBe(false);
  });

  it('PATCH /user/profile/foto (upload foto)', async () => {
    const res = await request(app.getHttpServer())
      .patch('/user/profile/foto')
      .set('Authorization', `Bearer ${token}`)
      .attach('foto', Buffer.from([1, 2, 3]), {
        filename: 'profile.jpg',
        contentType: 'image/jpeg',
      });
    expect(res.status).toBe(200);
    expect(res.body.foto).toMatch(/\/uploads\/profile\/.*\.jpg$/);
  });

  it('PATCH /user/profile/foto should fail for invalid file', async () => {
    const res = await request(app.getHttpServer())
      .patch('/user/profile/foto')
      .set('Authorization', `Bearer ${token}`)
      .attach('foto', Buffer.from([1, 2, 3]), {
        filename: 'profile.txt',
        contentType: 'text/plain',
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/file gambar/);
  });

  it('GET /user/admin-only (admin)', async () => {
    const res = await request(app.getHttpServer())
      .get('/user/admin-only')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Data khusus admin');
  });

  it('GET /user/pegawai-only (pegawai)', async () => {
    // Login sebagai pegawai
    const pegawaiRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'budi', password: 'budi123' });
    const pegawaiToken = pegawaiRes.body.access_token;

    const res = await request(app.getHttpServer())
      .get('/user/pegawai-only')
      .set('Authorization', `Bearer ${pegawaiToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Data khusus pegawai');
  });

  it('POST /user should fail if username exists', async () => {
    const res = await request(app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nama: 'User Test',
        username: uniqueUsername,
        password: 'test123',
        role: 'pegawai',
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Username sudah terdaftar/);
  });

  it('GET /user/:id should return 404 if not found', async () => {
    const res = await request(app.getHttpServer())
      .get('/user/999999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('PATCH /user/:id should return 404 if not found', async () => {
    const res = await request(app.getHttpServer())
      .patch('/user/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({ nama: 'Not Found' });
    expect(res.status).toBe(404);
  });

  it('DELETE /user/:id should return 404 if not found', async () => {
    const res = await request(app.getHttpServer())
      .delete('/user/999999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('GET /user/admin-only should return 403 for pegawai', async () => {
    const pegawaiRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'budi', password: 'budi123' });
    const pegawaiToken = pegawaiRes.body.access_token;

    const res = await request(app.getHttpServer())
      .get('/user/admin-only')
      .set('Authorization', `Bearer ${pegawaiToken}`);
    expect(res.status).toBe(403);
  });

  it('GET /user/pegawai-only should return 403 for admin', async () => {
    const res = await request(app.getHttpServer())
      .get('/user/pegawai-only')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('GET /user/profile should return 401 if no token', async () => {
    const res = await request(app.getHttpServer()).get('/user/profile');
    expect(res.status).toBe(401);
  });
});
