import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { execSync } from 'child_process';

// =================================================================================
// SUITE 1: User CRUD (e2e)
// Fokus: Menguji fungsionalitas dasar CRUD pada endpoint /user oleh admin.
// =================================================================================
describe('User CRUD (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let createdUserId: number;
  const uniqueUsername = `usertest_${Date.now()}`; // Pastikan username unik setiap run

  beforeAll(async () => {
    // Jalankan seeder sekali saja di awal untuk state awal yang bersih
    execSync('npm run seed', { stdio: 'inherit' });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login sebagai admin untuk mendapatkan token
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      username: 'admin',
      password: 'admin123',
    });

    // Aplikasi ini mengembalikan 201 untuk login, jadi kita expect 201
    expect(res.status).toBe(201);
    token = res.body.access_token;
    expect(token).toBeDefined();
  }, 30000);

  afterAll(async () => {
    // Jalankan seeder lagi untuk mereset state setelah semua test di suite ini selesai
    execSync('npm run seed', { stdio: 'inherit' });
    await app.close();
  });

  // Test cases untuk CRUD (sebagian besar sudah benar, hanya perbaikan kecil)
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
    createdUserId = res.body.id; // Simpan ID user yang baru dibuat
  });

  // Pastikan createdUserId ada sebelum menjalankan test yang bergantung padanya
  describe('tests with created user', () => {
    beforeEach(() => {
      if (!createdUserId) {
        throw new Error(
          'createdUserId is not defined. Skipping tests that depend on it.',
        );
      }
    });

    it('PATCH /user/:id (update)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/user/${createdUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nama: 'User Test Updated' });
      expect(res.status).toBe(200);
      expect(res.body.nama).toBe('User Test Updated');
    });

    it('GET /user/:id (find one)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/user/${createdUserId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(createdUserId);
    });

    it('DELETE /user/:id (soft delete)', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/user/${createdUserId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      // Cek kembali user untuk memastikan status_aktif sudah false
      const checkRes = await request(app.getHttpServer())
        .get(`/user/${createdUserId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(checkRes.body.status_aktif).toBe(false);
    });
  });

  it('GET /user (find all)', async () => {
    const res = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test cases untuk not found (sudah benar)
  it.each([
    ['GET', '/user/999999'],
    ['PATCH', '/user/999999'],
    ['DELETE', '/user/999999'],
  ])('%s %s (not found)', async (method, path) => {
    const res = await request(app.getHttpServer())
      [method.toLowerCase()](path)
      .set('Authorization', `Bearer ${token}`)
      .send({ nama: 'X' }); // Kirim body untuk PATCH
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/User tidak ditemukan/i);
  });

  // Test cases untuk profile (sudah benar)
  describe('User Profile', () => {
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

    it('PATCH /user/profile (ubah password)', async () => {
      const res = await request(app.getHttpServer())
        .patch('/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ password: 'newadmin123' });
      expect(res.status).toBe(200);
      // Password di response harusnya sudah di-hash, jadi tidak boleh sama
      expect(res.body.password).not.toBe('newadmin123');
    });
  });
});

// =================================================================================
// SUITE 2: Proteksi Endpoint Sesuai Role
// Fokus: Memastikan guard dan role-based access control berfungsi dengan benar.
// Prinsip: Buat data test sendiri dan bersihkan setelahnya (Setup & Teardown).
// =================================================================================
describe('Proteksi endpoint sesuai role', () => {
  let app: INestApplication;
  let adminToken: string;
  let pegawaiToken: string;
  let createdPegawaiId: number;

  // Gunakan data unik untuk user pegawai agar tidak konflik dengan seeder/test lain
  const pegawaiCredentials = {
    username: `pegawai.test.${Date.now()}`,
    password: 'password123',
    nama: 'Pegawai Test',
    role: 'pegawai',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // 1. Login sebagai Admin
    const adminRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'admin123',
      });
    adminToken = adminRes.body.access_token;
    expect(adminToken).toBeDefined();

    // 2. Admin membuat user Pegawai baru untuk test ini
    const createPegawaiRes = await request(app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(pegawaiCredentials);
    expect(createPegawaiRes.status).toBe(201);
    createdPegawaiId = createPegawaiRes.body.id; // Simpan ID untuk cleanup

    // 3. Login sebagai user Pegawai yang baru dibuat
    const pegawaiRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: pegawaiCredentials.username,
        password: pegawaiCredentials.password,
      });

    // Login sukses di aplikasi ini mengembalikan 201
    expect(pegawaiRes.status).toBe(201);
    pegawaiToken = pegawaiRes.body.access_token;
    expect(pegawaiToken).toBeDefined();
  }, 30000);

  afterAll(async () => {
    // Cleanup: Hapus user pegawai yang dibuat untuk test ini
    if (createdPegawaiId) {
      await request(app.getHttpServer())
        .delete(`/user/${createdPegawaiId}`)
        .set('Authorization', `Bearer ${adminToken}`);
    }
    await app.close();
  });

  // Test cases role access
  describe('Role-based Access', () => {
    it('Admin HARUS bisa akses endpoint admin-only', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/admin-only') // Asumsi endpoint ini ada
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });

    it('Pegawai TIDAK BISA akses endpoint admin-only', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/admin-only') // Asumsi endpoint ini ada
        .set('Authorization', `Bearer ${pegawaiToken}`);
      expect(res.status).toBe(403); // 403 Forbidden
    });

    it('Pegawai HARUS bisa akses endpoint pegawai-only', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/pegawai-only') // Asumsi endpoint ini ada
        .set('Authorization', `Bearer ${pegawaiToken}`);
      expect(res.status).toBe(200);
    });

    it('Admin TIDAK BISA akses endpoint pegawai-only', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/pegawai-only') // Asumsi endpoint ini ada
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(403); // 403 Forbidden
    });
  });

  describe('CRUD Access for Pegawai', () => {
    const testCases = [
      { method: 'get', path: '/user' },
      {
        method: 'post',
        path: '/user',
        body: { nama: 'X', username: 'x', password: 'x', role: 'pegawai' },
      },
      { method: 'patch', path: '/user/1', body: { nama: 'X' } },
      { method: 'delete', path: '/user/1' },
    ];

    it.each(testCases)(
      'Pegawai TIDAK BISA akses $method $path',
      async ({ method, path, body }) => {
        const res = await request(app.getHttpServer())
          [method](path)
          .set('Authorization', `Bearer ${pegawaiToken}`)
          .send(body || {}); // Kirim body jika ada
        expect(res.status).toBe(403);
      },
    );
  });

  describe('Profile Access for All Logged-in Users', () => {
    it('Admin HARUS bisa akses profilnya sendiri', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/profile')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.username).toBe('admin');
    });

    it('Pegawai HARUS bisa akses profilnya sendiri', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/profile')
        .set('Authorization', `Bearer ${pegawaiToken}`);
      expect(res.status).toBe(200);
      expect(res.body.username).toBe(pegawaiCredentials.username);
    });
  });
});
