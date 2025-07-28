import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Permintaan (e2e)', () => {
  let app: INestApplication;
  let pegawaiToken: string;
  let adminToken: string;
  let reqUserId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login sebagai admin untuk mendapatkan token
    const adminRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    adminToken = adminRes.body.access_token;

    // Login sebagai pegawai untuk mendapatkan token dan user ID
    const pegawaiRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'pegawai1', password: 'pegawai123' });
    pegawaiToken = pegawaiRes.body.access_token;
    reqUserId = pegawaiRes.body.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /permintaan -> harus berhasil membuat permintaan dengan multi-item', async () => {
    // Langkah 1: Ambil data barang yang aktif untuk digunakan dalam permintaan
    const barangRes = await request(app.getHttpServer())
      .get('/barang?status_aktif=true')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(barangRes.status).toBe(200);
    const barangList = barangRes.body;
    expect(barangList.length).toBeGreaterThanOrEqual(2); // Pastikan ada minimal 2 barang untuk dites

    // Langkah 2: Buat permintaan baru menggunakan token pegawai
    const createPermintaanRes = await request(app.getHttpServer())
      .post('/permintaan')
      .set('Authorization', `Bearer ${pegawaiToken}`)
      .send({
        items: [
          { id_barang: barangList[0].id, jumlah: 2 },
          { id_barang: barangList[1].id, jumlah: 5 },
        ],
        catatan: 'Untuk kebutuhan survei lapangan',
      });

    expect(createPermintaanRes.status).toBe(201); // 201 Created
    expect(createPermintaanRes.body.items.length).toBe(2);
    expect(createPermintaanRes.body.catatan).toBe(
      'Untuk kebutuhan survei lapangan',
    );

    // Langkah 3: Verifikasi bahwa data permintaan tersimpan dengan benar
    const getPermintaanRes = await request(app.getHttpServer())
      .get(`/permintaan/${createPermintaanRes.body.id}`)
      .set('Authorization', `Bearer ${pegawaiToken}`);

    expect(getPermintaanRes.status).toBe(200);
    expect(getPermintaanRes.body.items.length).toBe(2);
    expect(getPermintaanRes.body.items[0].barang.id).toBe(barangList[0].id);
    expect(getPermintaanRes.body.items[1].barang.id).toBe(barangList[1].id);
  });

  it('POST /permintaan -> harus gagal jika stok barang tidak mencukupi', async () => {
    // Langkah 1: Ambil data barang yang aktif
    const barangRes = await request(app.getHttpServer())
      .get('/barang?status_aktif=true')
      .set('Authorization', `Bearer ${adminToken}`);

    const barang = barangRes.body[0];
    const jumlahMinta = barang.stok + 100; // Meminta lebih dari stok yang ada

    // Langkah 2: Coba buat permintaan dengan jumlah melebihi stok
    const res = await request(app.getHttpServer())
      .post('/permintaan')
      .set('Authorization', `Bearer ${pegawaiToken}`)
      .send({
        items: [{ id_barang: barang.id, jumlah: jumlahMinta }],
        catatan: 'Test stok tidak cukup',
      });

    expect(res.status).toBe(400); // 400 Bad Request
    expect(res.body.message.toLowerCase()).toContain('stok barang');
    expect(res.body.message.toLowerCase()).toContain('tidak mencukupi');
  });

  it('GET /permintaan/riwayat -> harus mengembalikan riwayat permintaan milik pegawai yang login', async () => {
    const res = await request(app.getHttpServer())
      .get('/permintaan/riwayat')
      .set('Authorization', `Bearer ${pegawaiToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    // Pastikan semua permintaan yang dikembalikan adalah milik user yang sedang login
    const semuaMilikPegawai = res.body.every(
      (p) => p.pemohon?.id === reqUserId || p.id_user_pemohon === reqUserId,
    );
    expect(semuaMilikPegawai).toBe(true);
  });
});
