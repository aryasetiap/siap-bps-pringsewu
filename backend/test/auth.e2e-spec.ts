import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /auth/login - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    expect(res.status).toBe(201);
    expect(res.body.access_token).toBeDefined();
    expect(res.body.user.username).toBe('admin');
  });

  it('POST /auth/login - wrong password', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'wrongpass' });
    expect(res.status).toBe(401);
    // Terima dua kemungkinan pesan error
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

  afterAll(async () => {
    await app.close();
  });
});
