import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

/**
 * Suite pengujian CRUD User (e2e)
 *
 * Menguji fungsionalitas dasar CRUD pada endpoint /user oleh admin.
 */
describe('User CRUD (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let createdUserId: number;
  const uniqueUsername = `usertest_${Date.now()}`;

  /**
   * Inisialisasi aplikasi dan login sebagai admin sebelum seluruh pengujian dijalankan.
   *
   * @returns {Promise<void>}
   */
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

    expect(res.status).toBe(201);
    token = res.body.access_token;
    expect(token).toBeDefined();
  }, 30000);

  /**
   * Menutup aplikasi setelah seluruh pengujian selesai.
   *
   * @returns {Promise<void>}
   */
  afterAll(async () => {
    await app.close();
  });

  /**
   * Menguji endpoint pembuatan user baru.
   *
   * @returns {Promise<void>}
   */
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

  /**
   * Pengujian yang bergantung pada user yang telah dibuat.
   */
  describe('tests with created user', () => {
    /**
     * Memastikan createdUserId sudah terdefinisi sebelum menjalankan pengujian terkait.
     */
    beforeEach(() => {
      if (!createdUserId) {
        throw new Error(
          'createdUserId is not defined. Skipping tests that depend on it.',
        );
      }
    });

    /**
     * Menguji endpoint update user.
     *
     * @returns {Promise<void>}
     */
    it('PATCH /user/:id (update)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/user/${createdUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nama: 'User Test Updated' });
      expect(res.status).toBe(200);
      expect(res.body.nama).toBe('User Test Updated');
    });

    /**
     * Menguji endpoint mendapatkan user berdasarkan id.
     *
     * @returns {Promise<void>}
     */
    it('GET /user/:id (find one)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/user/${createdUserId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(createdUserId);
    });

    /**
     * Menguji endpoint soft delete user.
     *
     * @returns {Promise<void>}
     */
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
  });

  /**
   * Menguji endpoint mendapatkan seluruh user.
   *
   * @returns {Promise<void>}
   */
  it('GET /user (find all)', async () => {
    const res = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  /**
   * Menguji endpoint user yang tidak ditemukan.
   *
   * @param {string} method - Metode HTTP
   * @param {string} path - Path endpoint
   * @returns {Promise<void>}
   */
  it.each([
    ['GET', '/user/999999'],
    ['PATCH', '/user/999999'],
    ['DELETE', '/user/999999'],
  ])('%s %s (not found)', async (method, path) => {
    const res = await request(app.getHttpServer())
      [method.toLowerCase()](path)
      .set('Authorization', `Bearer ${token}`)
      .send({ nama: 'X' });
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/User tidak ditemukan/i);
  });

  /**
   * Pengujian terkait profil user.
   */
  describe('User Profile', () => {
    /**
     * Menguji endpoint melihat profil user.
     *
     * @returns {Promise<void>}
     */
    it('GET /user/profile (lihat profil)', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/profile')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.username).toBe('admin');
    });

    /**
     * Menguji endpoint mengubah profil user.
     *
     * @returns {Promise<void>}
     */
    it('PATCH /user/profile (edit profil)', async () => {
      const res = await request(app.getHttpServer())
        .patch('/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ nama: 'Admin Diperbarui' });
      expect(res.status).toBe(200);
      expect(res.body.nama).toBe('Admin Diperbarui');
    });
  });
});

/**
 * Suite pengujian proteksi endpoint sesuai role.
 *
 * Memastikan guard dan role-based access control berjalan dengan benar.
 */
describe('Proteksi endpoint sesuai role', () => {
  let app: INestApplication;
  let adminToken: string;
  let pegawaiToken: string;
  let createdPegawaiId: number;

  const pegawaiCredentials = {
    username: `pegawai.test.${Date.now()}`,
    password: 'password123',
    nama: 'Pegawai Test',
    role: 'pegawai',
  };

  /**
   * Inisialisasi aplikasi, login admin, dan membuat user pegawai sebelum pengujian.
   *
   * @returns {Promise<void>}
   */
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const adminRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'admin123',
      });
    adminToken = adminRes.body.access_token;
    expect(adminToken).toBeDefined();

    const createPegawaiRes = await request(app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(pegawaiCredentials);
    expect(createPegawaiRes.status).toBe(201);
    createdPegawaiId = createPegawaiRes.body.id;

    const pegawaiRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: pegawaiCredentials.username,
        password: pegawaiCredentials.password,
      });

    expect(pegawaiRes.status).toBe(201);
    pegawaiToken = pegawaiRes.body.access_token;
    expect(pegawaiToken).toBeDefined();
  }, 30000);

  /**
   * Menghapus user pegawai yang dibuat setelah pengujian selesai.
   *
   * @returns {Promise<void>}
   */
  afterAll(async () => {
    if (createdPegawaiId) {
      await request(app.getHttpServer())
        .delete(`/user/${createdPegawaiId}`)
        .set('Authorization', `Bearer ${adminToken}`);
    }
    await app.close();
  });

  /**
   * Pengujian akses endpoint berdasarkan role.
   */
  describe('Role-based Access', () => {
    /**
     * Menguji admin dapat mengakses endpoint khusus admin.
     *
     * @returns {Promise<void>}
     */
    it('Admin HARUS bisa akses endpoint admin-only', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/admin-only')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });

    /**
     * Menguji pegawai tidak dapat mengakses endpoint khusus admin.
     *
     * @returns {Promise<void>}
     */
    it('Pegawai TIDAK BISA akses endpoint admin-only', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/admin-only')
        .set('Authorization', `Bearer ${pegawaiToken}`);
      expect(res.status).toBe(403);
    });

    /**
     * Menguji pegawai dapat mengakses endpoint khusus pegawai.
     *
     * @returns {Promise<void>}
     */
    it('Pegawai HARUS bisa akses endpoint pegawai-only', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/pegawai-only')
        .set('Authorization', `Bearer ${pegawaiToken}`);
      expect(res.status).toBe(200);
    });

    /**
     * Menguji admin tidak dapat mengakses endpoint khusus pegawai.
     *
     * @returns {Promise<void>}
     */
    it('Admin TIDAK BISA akses endpoint pegawai-only', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/pegawai-only')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(403);
    });
  });

  /**
   * Pengujian akses CRUD oleh pegawai.
   */
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

    /**
     * Menguji pegawai tidak dapat mengakses endpoint CRUD user.
     *
     * @param {string} method - Metode HTTP
     * @param {string} path - Path endpoint
     * @param {object} [body] - Body request (opsional)
     * @returns {Promise<void>}
     */
    it.each(testCases)(
      'Pegawai TIDAK BISA akses $method $path',
      async ({ method, path, body }) => {
        const res = await request(app.getHttpServer())
          [method](path)
          .set('Authorization', `Bearer ${pegawaiToken}`)
          .send(body || {});
        expect(res.status).toBe(403);
      },
    );
  });

  /**
   * Pengujian akses profil untuk semua user yang sudah login.
   */
  describe('Profile Access for All Logged-in Users', () => {
    /**
     * Menguji admin dapat mengakses profilnya sendiri.
     *
     * @returns {Promise<void>}
     */
    it('Admin HARUS bisa akses profilnya sendiri', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/profile')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.username).toBe('admin');
    });

    /**
     * Menguji pegawai dapat mengakses profilnya sendiri.
     *
     * @returns {Promise<void>}
     */
    it('Pegawai HARUS bisa akses profilnya sendiri', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/profile')
        .set('Authorization', `Bearer ${pegawaiToken}`);
      expect(res.status).toBe(200);
      expect(res.body.username).toBe(pegawaiCredentials.username);
    });

    /**
     * Menguji admin dapat mengubah password melalui endpoint profil.
     *
     * @returns {Promise<void>}
     */
    it('PATCH /user/profile (ubah password)', async () => {
      const res = await request(app.getHttpServer())
        .patch('/user/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ password: 'newadmin123' });
      expect(res.status).toBe(200);
      expect(res.body.password).not.toBe('newadmin123');
    });
  });
});
