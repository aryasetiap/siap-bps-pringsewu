import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * Pengujian end-to-end untuk AppController.
 *
 * Tujuan:
 * - Melakukan pengujian endpoint utama aplikasi.
 */
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  /**
   * Inisialisasi aplikasi Nest sebelum setiap pengujian dijalankan.
   *
   * @returns {Promise<void>} Tidak mengembalikan nilai, hanya melakukan setup aplikasi.
   */
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  /**
   * Menguji endpoint GET '/' untuk memastikan mengembalikan status 200 dan pesan 'Hello World!'.
   *
   * @returns {Promise<void>} Tidak mengembalikan nilai, hanya melakukan assertion pada response.
   */
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
