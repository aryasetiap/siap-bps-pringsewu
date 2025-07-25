import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { execSync } from 'child_process';

describe('User CRUD (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let createdId: number;

  beforeAll(async () => {
    // Jalankan seeder sebelum test
    execSync('npm run seed', { stdio: 'inherit' });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login as admin
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    console.log('Login response:', res.body); // Debug
    token = res.body.access_token;

    // Hapus user test jika sudah ada
    await request(app.getHttpServer())
      .delete('/user')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'usertest' }); // Pastikan ada endpoint untuk bulk delete atau gunakan query langsung ke DB jika perlu
  }, 30000); // timeout 30 detik

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
      .send({ nama: 'Admin Updated' });
    expect(res.status).toBe(200);
    expect(res.body.nama).toBe('Admin Updated');
  });

  it('PATCH /user/profile (ubah password)', async () => {
    const res = await request(app.getHttpServer())
      .patch('/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: 'newadmin123' });
    expect(res.status).toBe(200);
    expect(res.body.password).not.toBe('newadmin123');
  });

  afterAll(async () => {
    // Reset data ke kondisi awal
    execSync('npm run seed', { stdio: 'inherit' });
    await app.close();
  });
});

describe('Proteksi endpoint sesuai role', () => {
  let app: INestApplication;
  let adminToken: string;
  let pegawaiToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login sebagai admin
    const adminRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    adminToken = adminRes.body.access_token;

    // Buat user pegawai jika belum ada
    await request(app.getHttpServer())
      .delete('/user')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'pegawai1' });

    await request(app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nama: 'Pegawai Satu',
        username: 'pegawai1',
        password: 'pegawai123',
        role: 'pegawai',
      });

    // Login sebagai pegawai
    const pegawaiRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'pegawai1', password: 'pegawai123' });
    pegawaiToken = pegawaiRes.body.access_token;
  });

  it('Admin bisa akses endpoint admin-only', async () => {
    const res = await request(app.getHttpServer())
      .get('/user/admin-only')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/admin/i);
  });

  it('Pegawai TIDAK bisa akses endpoint admin-only', async () => {
    const res = await request(app.getHttpServer())
      .get('/user/admin-only')
      .set('Authorization', `Bearer ${pegawaiToken}`);
    expect(res.status).toBe(403);
  });

  it('Pegawai bisa akses endpoint pegawai-only', async () => {
    const res = await request(app.getHttpServer())
      .get('/user/pegawai-only')
      .set('Authorization', `Bearer ${pegawaiToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/pegawai/i);
  });

  it('Admin TIDAK bisa akses endpoint pegawai-only', async () => {
    const res = await request(app.getHttpServer())
      .get('/user/pegawai-only')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(403);
  });

  it('Pegawai TIDAK bisa akses endpoint CRUD user', async () => {
    // GET /user
    let res = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${pegawaiToken}`);
    expect(res.status).toBe(403);

    // POST /user
    res = await request(app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${pegawaiToken}`)
      .send({
        nama: 'X',
        username: 'x',
        password: 'x',
        role: 'pegawai',
      });
    expect(res.status).toBe(403);

    // PATCH /user/1
    res = await request(app.getHttpServer())
      .patch('/user/1')
      .set('Authorization', `Bearer ${pegawaiToken}`)
      .send({ nama: 'X' });
    expect(res.status).toBe(403);

    // DELETE /user/1
    res = await request(app.getHttpServer())
      .delete('/user/1')
      .set('Authorization', `Bearer ${pegawaiToken}`);
    expect(res.status).toBe(403);
  });

  it('Semua user login bisa akses endpoint profile', async () => {
    // Admin
    let res = await request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('admin');

    // Pegawai
    res = await request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', `Bearer ${pegawaiToken}`);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('pegawai1');
  });

  afterAll(async () => {
    await app.close();
  });
});
