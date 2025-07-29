import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

/**
 * Pengujian end-to-end untuk fitur autentikasi.
 */
describe('Auth (e2e)', () => {
  let app: INestApplication;

  /**
   * Inisialisasi aplikasi NestJS sebelum seluruh pengujian dijalankan.
   * @returns {Promise<void>}
   */
  beforeAll(async (): Promise<void> => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  /**
   * Menguji endpoint POST /auth/login dengan kredensial yang benar.
   * Memastikan login berhasil dan token akses serta data user dikembalikan.
   * @returns {Promise<void>}
   */
  it('POST /auth/login - success', async (): Promise<void> => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    expect(res.status).toBe(201);
    expect(res.body.access_token).toBeDefined();
    expect(res.body.user.username).toBe('admin');
  });

  /**
   * Menguji endpoint POST /auth/login dengan password yang salah.
   * Memastikan respons status 401 dan pesan error yang sesuai.
   * @returns {Promise<void>}
   */
  it('POST /auth/login - wrong password', async (): Promise<void> => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'wrongpass' });
    expect(res.status).toBe(401);
    expect(
      res.body.message === 'Invalid password' ||
        res.body.message === 'User not found',
    ).toBe(true);
  });

  /**
   * Menguji endpoint POST /auth/login dengan username yang tidak terdaftar.
   * Memastikan respons status 401 dan pesan error "User not found".
   * @returns {Promise<void>}
   */
  it('POST /auth/login - user not found', async (): Promise<void> => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'nouser', password: 'pass' });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/User not found/);
  });

  /**
   * Menguji endpoint POST /auth/logout setelah login berhasil.
   * Memastikan logout berhasil dan pesan sukses dikembalikan.
   * @returns {Promise<void>}
   */
  it('POST /auth/logout - success', async (): Promise<void> => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    const token = login.body.access_token;
    const res = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/Logout success/);
  });

  /**
   * Menutup aplikasi NestJS setelah seluruh pengujian selesai.
   * @returns {Promise<void>}
   */
  afterAll(async (): Promise<void> => {
    await app.close();
  });
});
