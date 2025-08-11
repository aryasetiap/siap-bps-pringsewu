import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as path from 'path';
import * as fs from 'fs';

describe('User CRUD (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let pegawaiToken: string;
  let createdUserId: number;
  const uniqueUsername = `usertest_${Date.now()}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Login Admin
    const adminRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    adminToken = adminRes.body.access_token;

    // Login Pegawai
    const pegawaiRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'budi', password: 'budi123' });
    pegawaiToken = pegawaiRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  // --- GRUP TES CRUD PENGGUNA OLEH ADMIN ---
  describe('Admin User Management', () => {
    it('POST /user - should create a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/user')
        .set('Authorization', `Bearer ${adminToken}`)
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

    it('GET /user - should find all users', async () => {
      const res = await request(app.getHttpServer())
        .get('/user')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /user/:id - should find one user', async () => {
      const res = await request(app.getHttpServer())
        .get(`/user/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(createdUserId);
    });

    it('PATCH /user/:id - should update a user', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/user/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nama: 'User Test Updated' });
      expect(res.status).toBe(200);
      expect(res.body.nama).toBe('User Test Updated');
    });

    it('DELETE /user/:id - should soft delete a user by ID', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/user/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);

      const checkRes = await request(app.getHttpServer())
        .get(`/user/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(checkRes.body.status_aktif).toBe(false);
    });

    it('DELETE /user - should soft delete by username', async () => {
      // PERBAIKAN: Membuat user baru khusus untuk tes ini agar tidak ada efek samping
      const userToDelete = `delete_me_${Date.now()}`;
      const createRes = await request(app.getHttpServer())
        .post('/user')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nama: 'User to Delete',
          username: userToDelete,
          password: 'password',
          role: 'pegawai',
        });
      const userIdToDelete = createRes.body.id;

      // Lakukan operasi delete
      const deleteRes = await request(app.getHttpServer())
        .delete('/user')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ username: userToDelete });
      expect(deleteRes.status).toBe(200);

      // Verifikasi dengan GET request
      const checkRes = await request(app.getHttpServer())
        .get(`/user/${userIdToDelete}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(checkRes.status).toBe(200);
      expect(checkRes.body.status_aktif).toBe(false);
    });
  });

  // --- GRUP TES PROFIL PENGGUNA ---
  describe('User Profile Management', () => {
    it('GET /user/profile - should get own profile', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/profile')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.username).toBe('admin');
    });

    it('PATCH /user/profile - should edit own profile', async () => {
      const res = await request(app.getHttpServer())
        .patch('/user/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nama: 'Admin Diperbarui' });
      expect(res.status).toBe(200);
      expect(res.body.nama).toBe('Admin Diperbarui');
    });

    it('PATCH /user/profile/foto - should upload profile picture', async () => {
      const res = await request(app.getHttpServer())
        .patch('/user/profile/foto')
        .set('Authorization', `Bearer ${pegawaiToken}`) // Gunakan token pegawai
        .attach('foto', Buffer.from('fake image data'), {
          filename: 'profile.jpg',
          contentType: 'image/jpeg',
        });
      expect(res.status).toBe(200);
      expect(res.body.foto).toMatch(/uploads/);
    });

    it('PATCH /user/profile/foto - should fail for invalid file type', async () => {
      // PERBAIKAN: Tes ini sekarang mengharapkan status 400.
      // Controller Anda harus diperbaiki agar tidak melempar error 500.
      const res = await request(app.getHttpServer())
        .patch('/user/profile/foto')
        .set('Authorization', `Bearer ${pegawaiToken}`)
        .attach('foto', Buffer.from('not an image'), {
          filename: 'document.txt',
          contentType: 'text/plain',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Hanya file gambar yang diperbolehkan/);
    });
  });

  // --- GRUP TES ROLE & PERMISSION ---
  describe('Roles and Permissions', () => {
    it('GET /user/admin-only - should be accessible by admin', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/admin-only')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });

    it('GET /user/pegawai-only - should be accessible by pegawai', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/pegawai-only')
        .set('Authorization', `Bearer ${pegawaiToken}`);
      expect(res.status).toBe(200);
    });

    it('GET /user/admin-only - should return 403 for pegawai', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/admin-only')
        .set('Authorization', `Bearer ${pegawaiToken}`);
      expect(res.status).toBe(403);
    });

    it('GET /user/pegawai-only - should return 403 for admin', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/pegawai-only')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(403);
    });
  });
});
