/**
 * File seeder.ts
 *
 * Digunakan untuk melakukan proses seeding data awal pada aplikasi SIAP (Sistem Informasi Administrasi Pengelolaan Barang).
 * Proses ini meliputi pengosongan tabel, penambahan data user, barang, permintaan, dan detail permintaan.
 *
 * Tujuan utama: Memudahkan pengujian dan pengembangan aplikasi dengan data dummy yang merepresentasikan proses bisnis SIAP.
 */

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { User } from './entities/user.entity';
import { Barang } from './entities/barang.entity';
import { Permintaan } from './entities/permintaan.entity';
import { DetailPermintaan } from './entities/detail_permintaan.entity';
import ormconfig from '../ormconfig';

dotenv.config();

/**
 * Fungsi utama untuk melakukan proses seeding data pada database SIAP.
 *
 * Proses yang dilakukan:
 * 1. Inisialisasi koneksi database.
 * 2. Pengosongan seluruh data pada tabel terkait (detail_permintaan, permintaan, barang, users).
 * 3. Penambahan data user (admin dan pegawai).
 * 4. Penambahan data barang.
 * 5. Penambahan data permintaan dan detail permintaan.
 * 6. Penutupan koneksi database.
 *
 * Parameter: Tidak ada.
 *
 * Return:
 * - Promise<void>: Tidak mengembalikan nilai, hanya menjalankan proses seeding.
 */
async function seed(): Promise<void> {
  const dataSource = await ormconfig.initialize();

  // Pengosongan seluruh data pada tabel utama, termasuk reset auto increment
  await truncateTables(dataSource);

  // Proses seeding data user
  const savedUsers = await seedUsers(dataSource);

  // Proses seeding data barang
  const savedBarang = await seedBarang(dataSource);

  // Proses seeding data permintaan dan detail permintaan
  await seedPermintaanDanDetail(dataSource, savedUsers, savedBarang);

  await dataSource.destroy();
  console.log('Seeding selesai');
}

/**
 * Fungsi untuk mengosongkan tabel utama pada database SIAP.
 *
 * Parameter:
 * - dataSource (DataSource): Koneksi database yang sudah diinisialisasi.
 *
 * Return:
 * - Promise<void>: Tidak mengembalikan nilai.
 */
async function truncateTables(dataSource: DataSource): Promise<void> {
  await dataSource.query(`
    TRUNCATE TABLE "detail_permintaan", "permintaan", "barang", "users" RESTART IDENTITY CASCADE
  `);
}

/**
 * Fungsi untuk melakukan seeding data user (admin dan pegawai).
 *
 * Parameter:
 * - dataSource (DataSource): Koneksi database yang sudah diinisialisasi.
 *
 * Return:
 * - Promise<User[]>: Array user yang sudah tersimpan di database.
 */
async function seedUsers(dataSource: DataSource): Promise<User[]> {
  const userRepo = dataSource.getRepository(User);

  const users: Partial<User>[] = [
    {
      nama: 'Admin SIAP',
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      unit_kerja: 'Kepala Kantor',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Admin+SIAP',
    },
    {
      nama: 'Budi Santoso',
      username: 'budi',
      password: await bcrypt.hash('budi123', 10),
      role: 'pegawai',
      unit_kerja: 'Statistik Produksi',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Budi+Santoso',
    },
    {
      nama: 'Siti Aminah',
      username: 'siti',
      password: await bcrypt.hash('siti123', 10),
      role: 'pegawai',
      unit_kerja: 'Statistik Sosial',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Siti+Aminah',
    },
    {
      nama: 'Rudi Hartono',
      username: 'rudi',
      password: await bcrypt.hash('rudi123', 10),
      role: 'pegawai',
      unit_kerja: 'Bagian Umum',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Rudi+Hartono',
    },
    {
      nama: 'Dewi Lestari',
      username: 'dewi',
      password: await bcrypt.hash('dewi123', 10),
      role: 'pegawai',
      unit_kerja: 'Statistik Distribusi',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Dewi+Lestari',
    },
    {
      nama: 'Nonaktif User',
      username: 'nonaktif',
      password: await bcrypt.hash('password', 10),
      role: 'pegawai',
      unit_kerja: 'Testing',
      status_aktif: false,
      foto: 'https://ui-avatars.com/api/?name=Nonaktif+User',
    },
  ];

  return await userRepo.save(userRepo.create(users));
}

/**
 * Fungsi untuk melakukan seeding data barang pada aplikasi SIAP.
 *
 * Barang yang diinputkan merepresentasikan berbagai kategori barang yang dikelola oleh kantor.
 *
 * Parameter:
 * - dataSource (DataSource): Koneksi database yang sudah diinisialisasi.
 *
 * Return:
 * - Promise<Barang[]>: Array barang yang sudah tersimpan di database.
 */
async function seedBarang(dataSource: DataSource): Promise<Barang[]> {
  const barangRepo = dataSource.getRepository(Barang);

  const kategoriList = ['ATK', 'Elektronik', 'Konsumsi', 'Dokumen', 'Lainnya'];
  const satuanList = ['pcs', 'box', 'pak', 'rim', 'unit'];
  const barangList: Partial<Barang>[] = [];

  for (let i = 1; i <= 50; i++) {
    barangList.push({
      kode_barang: `BRG${i.toString().padStart(3, '0')}`,
      nama_barang: `Barang Contoh ${i}`,
      deskripsi: `Deskripsi barang contoh ke-${i}`,
      satuan: satuanList[i % satuanList.length],
      stok: i === 5 ? 1 : Math.max(20, Math.floor(Math.random() * 100)), // BRG005 stok 1
      ambang_batas_kritis: Math.floor(Math.random() * 10) + 1,
      status_aktif: true,
      foto: undefined,
      kategori: kategoriList[i % kategoriList.length],
    });
  }

  return await barangRepo.save(barangRepo.create(barangList));
}

/**
 * Fungsi untuk melakukan seeding data permintaan dan detail permintaan barang.
 *
 * Permintaan merepresentasikan proses pengajuan barang oleh pegawai, sedangkan detail permintaan berisi daftar barang yang diminta.
 *
 * Parameter:
 * - dataSource (DataSource): Koneksi database yang sudah diinisialisasi.
 * - users (User[]): Array user yang sudah tersimpan di database.
 * - barangs (Barang[]): Array barang yang sudah tersimpan di database.
 *
 * Return:
 * - Promise<void>: Tidak mengembalikan nilai.
 */
async function seedPermintaanDanDetail(
  dataSource: DataSource,
  users: User[],
  barangs: Barang[],
): Promise<void> {
  const permintaanRepo = dataSource.getRepository(Permintaan);
  const detailPermintaanRepo = dataSource.getRepository(DetailPermintaan);

  const statusArr: (
    | 'Menunggu'
    | 'Disetujui'
    | 'Ditolak'
    | 'Disetujui Sebagian'
  )[] = ['Menunggu', 'Disetujui', 'Ditolak', 'Disetujui Sebagian'];
  const permintaanArr: Partial<Permintaan>[] = [];

  // Membuat 100 permintaan barang secara acak
  for (let i = 0; i < 100; i++) {
    const user = users[i % users.length];
    const status = statusArr[i % statusArr.length];

    // Generate tanggal permintaan acak dalam 1 tahun terakhir (Agustus 2024 - Juli 2025)
    const startDate = new Date('2024-08-01T00:00:00Z').getTime();
    const endDate = new Date('2025-07-31T23:59:59Z').getTime();
    const randomTime = startDate + Math.random() * (endDate - startDate);
    const tanggal_permintaan = new Date(randomTime);

    permintaanArr.push({
      id_user_pemohon: user.id,
      tanggal_permintaan,
      status,
      catatan: status === 'Ditolak' ? 'Stok tidak cukup' : '',
    });
  }

  const savedPermintaan = await permintaanRepo.save(
    permintaanRepo.create(permintaanArr),
  );

  // Membuat detail permintaan untuk setiap permintaan (multi-item)
  const detailArr: Partial<DetailPermintaan>[] = [];
  for (let i = 0; i < savedPermintaan.length; i++) {
    const permintaan = savedPermintaan[i];
    const jumlahItem = Math.floor(Math.random() * 4) + 1; // 1-4 barang per permintaan

    for (let j = 0; j < jumlahItem; j++) {
      const barang = barangs[(i + j) % barangs.length];
      detailArr.push({
        id_permintaan: permintaan.id,
        id_barang: barang.id,
        jumlah_diminta: Math.floor(Math.random() * 5) + 1,
        jumlah_disetujui:
          permintaan.status === 'Disetujui'
            ? Math.floor(Math.random() * 5) + 1
            : 0,
      });
    }
  }

  await detailPermintaanRepo.save(detailPermintaanRepo.create(detailArr));
}

/**
 * Fungsi utama untuk menjalankan proses seeding dan menangani error jika terjadi.
 *
 * Parameter: Tidak ada.
 *
 * Return:
 * - void: Proses akan keluar dengan kode 1 jika terjadi error.
 */
seed().catch((err) => {
  console.error('Seeding gagal:', err);
  process.exit(1);
});
