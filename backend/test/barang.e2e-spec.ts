import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Barang E2E', () => {
  let app: INestApplication;
  let adminToken: string;
  let pegawaiToken: string;
  let createdBarangId: number;

  // -- SETUP --
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Login sebagai admin untuk mendapatkan token admin
    const adminRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    adminToken = adminRes.body.access_token;

    // Login sebagai pegawai untuk mendapatkan token pegawai
    const pegawaiRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'budi', password: 'budi123' });
    pegawaiToken = pegawaiRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  // -- GRUP TES UNTUK AKSI ADMIN --
  describe('Admin Actions on /barang', () => {
    it('POST / - should create a new barang', async () => {
      // PERBAIKAN: Mengubah format kode unik untuk menghindari masalah validasi
      const uniqueKode = 'BRG' + Date.now();
      const res = await request(app.getHttpServer())
        .post('/barang')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          kode_barang: uniqueKode,
          nama_barang: 'Barang Test E2E',
          satuan: 'unit',
          stok: 20,
          ambang_batas_kritis: 5,
        });

      expect(res.status).toBe(201);
      expect(res.body.kode_barang).toBe(uniqueKode);
      createdBarangId = res.body.id; // Simpan ID untuk tes selanjutnya
    });

    it('POST / - should fail if kode_barang already exists', () => {
      return request(app.getHttpServer())
        .post('/barang')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          kode_barang: 'BRG001', // Kode yang sudah ada dari seeder
          nama_barang: 'Barang Duplikat',
          satuan: 'pcs',
          stok: 10,
          ambang_batas_kritis: 2,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toMatch(/Kode barang sudah terdaftar/);
        });
    });

    it('GET / - should find all barang', () => {
      return request(app.getHttpServer())
        .get('/barang')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /:id - should find one barang by id', () => {
      return request(app.getHttpServer())
        .get(`/barang/${createdBarangId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdBarangId);
        });
    });

    it('PATCH /:id - should update a barang', () => {
      return request(app.getHttpServer())
        .patch(`/barang/${createdBarangId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nama_barang: 'Barang E2E Updated' })
        .expect(200)
        .expect((res) => {
          expect(res.body.nama_barang).toBe('Barang E2E Updated');
        });
    });

    it('PATCH /:id/add-stok - should add stock to a barang', async () => {
      const initialRes = await request(app.getHttpServer())
        .get(`/barang/${createdBarangId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      const initialStok = initialRes.body.stok;

      const res = await request(app.getHttpServer())
        .patch(`/barang/${createdBarangId}/add-stok`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ jumlah: 10 });

      expect(res.status).toBe(200);
      expect(res.body.stok).toBe(initialStok + 10);
    });

    it('DELETE /:id - should soft delete a barang', async () => {
      // PERBAIKAN: Mengubah format kode unik agar konsisten
      const uniqueKode = 'BRGDEL' + Date.now();
      const createRes = await request(app.getHttpServer())
        .post('/barang')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          kode_barang: uniqueKode,
          nama_barang: 'Barang to Delete',
          satuan: 'pcs',
          stok: 5,
          ambang_batas_kritis: 1,
        });
      const idToDelete = createRes.body.id;

      const deleteRes = await request(app.getHttpServer())
        .delete(`/barang/${idToDelete}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.status_aktif).toBe(false);
    });
  });

  // -- GRUP TES UNTUK AKSI PEGAWAI --
  describe('Pegawai Actions on /barang', () => {
    it('GET /available - should get all available (active) barang', () => {
      return request(app.getHttpServer())
        .get('/barang/available')
        .set('Authorization', `Bearer ${pegawaiToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          const allActive = res.body.every((b) => b.status_aktif === true);
          expect(allActive).toBe(true);
        });
    });
  });

  // -- GRUP TES UNTUK LAPORAN & DASHBOARD (DIAKSES ADMIN) --
  describe('Reports and Dashboard (Admin Access)', () => {
    it('GET /stok-kritis - should get barang with critical stock', () => {
      return request(app.getHttpServer())
        .get('/barang/stok-kritis')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /dashboard/notifikasi-stok-kritis - should get notifications', () => {
      return request(app.getHttpServer())
        .get('/barang/dashboard/notifikasi-stok-kritis')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /laporan-penggunaan - should get usage report', () => {
      return request(app.getHttpServer())
        .get('/barang/laporan-penggunaan?start=2024-07-01&end=2024-07-31')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /laporan-penggunaan/pdf - should get usage report as PDF', () => {
      return request(app.getHttpServer())
        .get('/barang/laporan-penggunaan/pdf?start=2024-07-01&end=2024-07-31')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect('Content-Type', /pdf/)
        .expect('Content-Disposition', /attachment/);
    });
  });

  // -- GRUP TES UNTUK VALIDASI DAN KASUS GAGAL --
  describe('Validation and Failure Cases', () => {
    it('PATCH /:id - should fail if stok is negative', () => {
      return request(app.getHttpServer())
        .patch(`/barang/${createdBarangId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ stok: -1 })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBeInstanceOf(Array);
          expect(res.body.message[0]).toMatch(/must not be less than 0/);
        });
    });

    it('PATCH /:id/add-stok - should fail if jumlah < 1', () => {
      return request(app.getHttpServer())
        .patch(`/barang/${createdBarangId}/add-stok`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ jumlah: 0 })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBeInstanceOf(Array);
          expect(res.body.message[0]).toMatch(/must not be less than 1/);
        });
    });

    it('GET /laporan-penggunaan - should fail if date format is invalid', () => {
      return request(app.getHttpServer())
        .get('/barang/laporan-penggunaan?start=2024-7-1&end=2024-07-31')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toMatch(/Format tanggal harus YYYY-MM-DD/);
        });
    });

    it('GET /laporan-penggunaan - should fail if start date > end date', () => {
      return request(app.getHttpServer())
        .get('/barang/laporan-penggunaan?start=2024-08-01&end=2024-07-31')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toMatch(
            /Tanggal mulai harus <= tanggal akhir/,
          );
        });
    });
  });
});
