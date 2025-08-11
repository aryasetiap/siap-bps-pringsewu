import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

// Helper function untuk membuat permintaan baru
const createPermintaan = async (app: INestApplication, token: string) => {
  const res = await request(app.getHttpServer())
    .post('/permintaan')
    .set('Authorization', `Bearer ${token}`)
    .send({
      items: [
        { id_barang: 1, jumlah: 5 }, // Barang dengan stok cukup
        { id_barang: 2, jumlah: 3 },
      ],
      catatan: 'Permintaan untuk tes E2E',
    });
  return res.body;
};

describe('Permintaan E2E', () => {
  let app: INestApplication;
  let pegawaiToken: string;
  let adminToken: string;
  let mainPermintaanId: number; // Permintaan utama untuk tes non-verifikasi

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Login pegawai
    const pegawaiRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'budi', password: 'budi123' });
    pegawaiToken = pegawaiRes.body.access_token;

    // Login admin
    const adminRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    adminToken = adminRes.body.access_token;

    // Buat satu permintaan utama untuk tes umum
    const permintaan = await createPermintaan(app, pegawaiToken);
    mainPermintaanId = permintaan.id;
  });

  afterAll(async () => {
    await app.close();
  });

  // --- TES UMUM ---
  describe('General Flow', () => {
    it('Pegawai dapat melihat riwayat permintaan miliknya', async () => {
      const res = await request(app.getHttpServer())
        .get('/permintaan/riwayat')
        .set('Authorization', `Bearer ${pegawaiToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('Pegawai dapat melihat detail permintaan miliknya', async () => {
      const res = await request(app.getHttpServer())
        .get(`/permintaan/${mainPermintaanId}`)
        .set('Authorization', `Bearer ${pegawaiToken}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(mainPermintaanId);
    });

    it('Pegawai TIDAK BISA melihat permintaan milik user lain', async () => {
      const sitiRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'siti', password: 'siti123' });
      const tokenSiti = sitiRes.body.access_token;
      const res = await request(app.getHttpServer())
        .get(`/permintaan/${mainPermintaanId}`)
        .set('Authorization', `Bearer ${tokenSiti}`);
      expect(res.status).toBe(403);
    });

    it('Admin dapat melihat daftar permintaan masuk (Menunggu)', async () => {
      const res = await request(app.getHttpServer())
        .get('/permintaan/masuk')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // --- TES VERIFIKASI (Setiap tes independen) ---
  describe('Admin Verification Scenarios', () => {
    it('Admin dapat memverifikasi permintaan (setuju semua)', async () => {
      const permintaan = await createPermintaan(app, pegawaiToken);
      const items = permintaan.items.map((item) => ({
        id_detail: item.id,
        jumlah_disetujui: item.jumlah_diminta,
      }));

      const res = await request(app.getHttpServer())
        .patch(`/permintaan/${permintaan.id}/verifikasi`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          keputusan: 'setuju',
          items,
          catatan_verifikasi: 'Disetujui penuh',
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Disetujui');
    });

    it('Admin dapat memverifikasi permintaan (sebagian)', async () => {
      const permintaan = await createPermintaan(app, pegawaiToken);
      const items = permintaan.items.map((item) => ({
        id_detail: item.id,
        jumlah_disetujui: Math.max(0, item.jumlah_diminta - 1),
      }));

      const res = await request(app.getHttpServer())
        .patch(`/permintaan/${permintaan.id}/verifikasi`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          keputusan: 'sebagian',
          items,
          catatan_verifikasi: 'Disetujui sebagian',
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Disetujui Sebagian');
    });

    it('Admin dapat memverifikasi permintaan (tolak)', async () => {
      const permintaan = await createPermintaan(app, pegawaiToken);
      const items = permintaan.items.map((item) => ({
        id_detail: item.id,
        jumlah_disetujui: 0,
      }));

      const res = await request(app.getHttpServer())
        .patch(`/permintaan/${permintaan.id}/verifikasi`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          keputusan: 'tolak',
          items,
          catatan_verifikasi: 'Ditolak',
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Ditolak');
    });
  });

  // --- TES KASUS GAGAL (Setiap tes independen) ---
  describe('Failure and Validation Cases', () => {
    it('Verifikasi gagal jika jumlah_disetujui > jumlah_diminta', async () => {
      const permintaan = await createPermintaan(app, pegawaiToken);
      const item = permintaan.items[0];

      const res = await request(app.getHttpServer())
        .patch(`/permintaan/${permintaan.id}/verifikasi`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          keputusan: 'setuju',
          items: [
            { id_detail: item.id, jumlah_disetujui: item.jumlah_diminta + 1 },
          ],
        });

      expect(res.status).toBe(400);
      // PERBAIKAN: Sesuaikan dengan pesan error yang lebih spesifik dari API
      expect(res.body.message).toMatch(
        /Jumlah disetujui tidak boleh melebihi jumlah diminta/,
      );
    });

    it('Verifikasi gagal jika jumlah_disetujui > stok barang', async () => {
      const permintaan = await createPermintaan(app, pegawaiToken);
      const item = permintaan.items[0];

      const res = await request(app.getHttpServer())
        .patch(`/permintaan/${permintaan.id}/verifikasi`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          keputusan: 'setuju',
          items: [{ id_detail: item.id, jumlah_disetujui: 9999 }], // Jumlah yang pasti melebihi stok
        });
      expect(res.status).toBe(400);
      // PERBAIKAN: Buat regex lebih fleksibel untuk menangani pesan error dinamis
      expect(res.body.message).toMatch(/Stok barang .* tidak mencukupi/);
    });

    it('Verifikasi gagal jika permintaan sudah diverifikasi', async () => {
      const permintaan = await createPermintaan(app, pegawaiToken);
      const items = permintaan.items.map((item) => ({
        id_detail: item.id,
        jumlah_disetujui: item.jumlah_diminta,
      }));

      // Verifikasi pertama (sukses)
      await request(app.getHttpServer())
        .patch(`/permintaan/${permintaan.id}/verifikasi`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ keputusan: 'setuju', items });

      // Verifikasi kedua (harus gagal)
      const res = await request(app.getHttpServer())
        .patch(`/permintaan/${permintaan.id}/verifikasi`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ keputusan: 'setuju', items });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/sudah diverifikasi/);
    });

    it('Tidak bisa mengajukan permintaan barang dengan stok kurang', async () => {
      const res = await request(app.getHttpServer())
        .post('/permintaan')
        .set('Authorization', `Bearer ${pegawaiToken}`)
        .send({
          items: [{ id_barang: 1, jumlah: 9999 }], // Jumlah yang pasti melebihi stok
          catatan: 'Test stok kurang',
        });
      expect(res.status).toBe(400);
      // PERBAIKAN: Buat regex lebih fleksibel
      expect(res.body.message).toMatch(/Stok barang .* tidak mencukupi/);
    });
  });

  // --- TES PDF & LAINNYA ---
  describe('PDF and Other Endpoints', () => {
    it('GET /permintaan/:id/pdf returns PDF for admin', async () => {
      const res = await request(app.getHttpServer())
        .get(`/permintaan/${mainPermintaanId}/pdf`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.header['content-type']).toBe('application/pdf');
    });

    it('GET /permintaan/:id/pdf returns PDF for pegawai pemilik', async () => {
      const res = await request(app.getHttpServer())
        .get(`/permintaan/${mainPermintaanId}/pdf`)
        .set('Authorization', `Bearer ${pegawaiToken}`);
      expect(res.status).toBe(200);
      expect(res.header['content-type']).toBe('application/pdf');
    });

    it('GET /permintaan/all returns paginated data', async () => {
      const res = await request(app.getHttpServer())
        .get('/permintaan/all?status=Menunggu&page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
    });
  });
});
