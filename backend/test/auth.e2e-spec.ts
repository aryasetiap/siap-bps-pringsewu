import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { AppModule } from './../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/login - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    expect(res.status).toBe(201);
    expect(res.body.access_token).toBeDefined();
    expect(res.body.user.username).toBe('admin');
    token = res.body.access_token;
  });

  it('POST /auth/login - wrong password', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'wrongpass' });
    expect(res.status).toBe(401);
    expect(
      res.body.message === 'Invalid password' ||
        res.body.message === 'User not found',
    ).toBe(true);
  });

  it('POST /auth/login - user not found', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'nouser', password: 'pass' });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/User not found/);
  });

  it('POST /auth/logout - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/Logout success/);
  });

  it('POST /auth/logout - no token', async () => {
    const res = await request(app.getHttpServer()).post('/auth/logout');
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('No token provided');
  });

  it('GET /user/profile - should fail without token', async () => {
    const res = await request(app.getHttpServer()).get('/user/profile');
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Unauthorized/);
  });

  it('GET /user/profile - should succeed with valid token', async () => {
    const res = await request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('admin');
  });

  it('GET /user/admin-only - should allow admin', async () => {
    const res = await request(app.getHttpServer())
      .get('/user/admin-only')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('GET /user/admin-only - should deny pegawai', async () => {
    // Login sebagai pegawai
    const pegawaiRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'budi', password: 'budi123' });
    const pegawaiToken = pegawaiRes.body.access_token;

    const res = await request(app.getHttpServer())
      .get('/user/admin-only')
      .set('Authorization', `Bearer ${pegawaiToken}`);
    expect(res.status).toBe(403);
  });

  it('GET /user/profile - should fail with blacklisted token', async () => {
    // Logout untuk blacklist token
    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token}`);

    // Coba akses endpoint dengan token yang sudah di-blacklist
    const res = await request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Token telah dicabut|Unauthorized/);
  });

  it('POST /auth/login - JWT payload should have sub, username, role', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    expect(res.status).toBe(201);
    const jwt = res.body.access_token;
    // Decode JWT tanpa verifikasi (base64 decode)
    const payload = JSON.parse(
      Buffer.from(jwt.split('.')[1], 'base64').toString('utf8'),
    );
    expect(payload).toHaveProperty('sub');
    expect(payload).toHaveProperty('username');
    expect(payload).toHaveProperty('role');
  });

  it('GET /user/pegawai-only - should allow pegawai', async () => {
    const pegawaiRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'budi', password: 'budi123' });
    const pegawaiToken = pegawaiRes.body.access_token;

    const res = await request(app.getHttpServer())
      .get('/user/pegawai-only')
      .set('Authorization', `Bearer ${pegawaiToken}`);
    expect(res.status).toBe(200);
  });

  it('GET /user/pegawai-only - should deny admin', async () => {
    const res = await request(app.getHttpServer())
      .get('/user/pegawai-only')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('POST /auth/login & logout - pegawai', async () => {
    const pegawaiRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'budi', password: 'budi123' });
    expect(pegawaiRes.status).toBe(201);
    const pegawaiToken = pegawaiRes.body.access_token;

    const logoutRes = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${pegawaiToken}`);
    expect(logoutRes.status).toBe(201);
    expect(logoutRes.body.message).toMatch(/Logout/);
  });

  it('GET /user/profile - should fail with expired token', async () => {
    // Generate expired JWT
    const expiredToken = jwt.sign(
      { sub: 1, username: 'admin', role: 'admin' },
      process.env.JWT_SECRET || 'devsecret',
      { expiresIn: -10 }, // expired 10s ago
    );
    const res = await request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/jwt expired|Unauthorized/);
  });

  it('GET /user/profile - should fail with invalid token', async () => {
    const res = await request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/jwt malformed|Unauthorized/);
  });

  it('GET /user/profile - pegawai token blacklisted should fail', async () => {
    // Login pegawai
    const pegawaiRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'budi', password: 'budi123' });
    const pegawaiToken = pegawaiRes.body.access_token;

    // Logout pegawai
    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${pegawaiToken}`);

    // Coba akses endpoint dengan token yang sudah di-blacklist
    const res = await request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', `Bearer ${pegawaiToken}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Token telah dicabut|Unauthorized/);
  });

  it('POST /auth/login - error response should have error field', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'nouser', password: 'pass' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Unauthorized');
  });

  it('GET /notfound - should return 404', async () => {
    const res = await request(app.getHttpServer()).get('/notfound');
    expect(res.status).toBe(404);
  });

  it('POST /auth/login - should fail for nonaktif user', async () => {
    // Pastikan ada user nonaktif di database, misal username: 'nonaktif'
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'nonaktif', password: 'password' });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/User tidak aktif|Unauthorized/);
  });
});
