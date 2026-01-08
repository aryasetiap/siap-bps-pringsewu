/**
 * File seeder.ts
 *
 * Digunakan untuk melakukan proses seeding data awal pada aplikasi SIAP (Sistem Informasi Administrasi Pengelolaan Barang).
 * Proses ini meliputi pengosongan tabel dan penambahan data user produksi BPS Pringsewu.
 *
 * Tujuan utama: Memudahkan pengujian dan pengembangan aplikasi dengan data user produksi yang sesungguhnya.
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
 * 2. Pengosongan seluruh data pada tabel.
 * 3. Penambahan data user, barang, dan permintaan dummy.
 * 4. Penutupan koneksi database.
 *
 * Parameter: Tidak ada.
 *
 * Return:
 * - Promise<void>: Tidak mengembalikan nilai, hanya menjalankan proses seeding.
 */
async function seed(): Promise<void> {
  const dataSource = await ormconfig.initialize();

  // Truncate tables dalam urutan yang benar (foreign key dependencies)
  await truncatePermintaanTables(dataSource);
  await truncateBarangTable(dataSource);
  await truncateUserTable(dataSource);

  // Seed data dalam urutan yang benar
  const users = await seedUsers(dataSource);
  const barangs = await seedBarang(dataSource);
  await seedPermintaan(dataSource, users, barangs);

  await dataSource.destroy();
  console.log(
    '✅ Seeding lengkap: user, barang, dan permintaan berhasil dibuat',
  );
}

/**
 * Fungsi untuk mengosongkan tabel permintaan dan detail_permintaan.
 */
async function truncatePermintaanTables(dataSource: DataSource): Promise<void> {
  await dataSource.query(`
    TRUNCATE TABLE "detail_permintaan" RESTART IDENTITY CASCADE
  `);
  await dataSource.query(`
    TRUNCATE TABLE "permintaan" RESTART IDENTITY CASCADE
  `);
  console.log('🗑️ Tabel permintaan dan detail_permintaan dikosongkan');
}

/**
 * Fungsi untuk mengosongkan tabel users pada database SIAP.
 */
async function truncateUserTable(dataSource: DataSource): Promise<void> {
  await dataSource.query(`
    TRUNCATE TABLE "users" RESTART IDENTITY CASCADE
  `);
  console.log('🗑️ Tabel users dikosongkan');
}

/**
 * Fungsi untuk mengosongkan tabel barang.
 */
async function truncateBarangTable(dataSource: DataSource): Promise<void> {
  await dataSource.query(`
    TRUNCATE TABLE "barang" RESTART IDENTITY CASCADE
  `);
  console.log('🗑️ Tabel barang dikosongkan');
}

/**
 * Fungsi untuk melakukan seeding data user (admin dan pegawai produksi BPS Pringsewu).
 */
async function seedUsers(dataSource: DataSource): Promise<User[]> {
  const userRepo = dataSource.getRepository(User);

  const users: Partial<User>[] = [
    // Admin Account
    {
      nama: 'Admin SIAP',
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      unit_kerja: 'Sistem Administrator',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Admin+SIAP',
    },
    // Kepala BPS
    {
      nama: 'Eko Purnomo, SST., MM',
      username: 'eko.purnomo',
      password: await bcrypt.hash('197309131994031004', 10),
      role: 'admin',
      unit_kerja: 'Kepala BPS Kabupaten/Kota',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Eko+Purnomo',
    },
    // Pegawai untuk testing - dengan username yang mudah diingat
    {
      nama: 'Budi Setiawan',
      username: 'budi',
      password: await bcrypt.hash('budi123', 10),
      role: 'pegawai',
      unit_kerja: 'Seksi Statistik Sosial',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Budi+Setiawan',
    },
    {
      nama: 'Sari Indah',
      username: 'sari',
      password: await bcrypt.hash('sari123', 10),
      role: 'pegawai',
      unit_kerja: 'Seksi Statistik Produksi',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Sari+Indah',
    },
    // Pegawai BPS Pringsewu yang sudah ada...
    {
      nama: 'Erwansyah Yusup',
      username: 'erwansyah',
      password: await bcrypt.hash('197205201994031004', 10),
      role: 'pegawai',
      unit_kerja: 'Fungsional Umum BPS Kabupaten/Kota',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Erwansyah+Yusup',
    },
    {
      nama: 'Resty Sopiyono, SST, M.E.K.K.',
      username: 'sresty',
      password: await bcrypt.hash('198810132010122005', 10),
      role: 'pegawai',
      unit_kerja: 'Statistisi Ahli Madya BPS Kabupaten/Kota',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Resty+Sopiyono',
    },
    {
      nama: 'Ahmad Rifki Febrianto, SST, M.EKK',
      username: 'arifki',
      password: await bcrypt.hash('198902082010121005', 10),
      role: 'pegawai',
      unit_kerja: 'Pranata Komputer Ahli Muda BPS Kabupaten/Kota',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Ahmad+Rifki+Febrianto',
    },
    // Tambah beberapa pegawai lagi untuk variasi demo
    {
      nama: 'Dewi Yuliana S., S.T.',
      username: 'dewiyuliana',
      password: await bcrypt.hash('198207182005022001', 10),
      role: 'pegawai',
      unit_kerja: 'Statistisi Ahli Muda BPS Kabupaten/Kota',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Dewi+Yuliana',
    },
  ];

  const savedUsers = await userRepo.save(userRepo.create(users));

  console.log(`✅ Berhasil membuat ${savedUsers.length} user:`);
  console.log(`   - 2 Admin (admin, eko.purnomo)`);
  console.log(`   - ${savedUsers.length - 2} Pegawai BPS Pringsewu`);

  return savedUsers;
}

/**
 * Fungsi untuk seeding data barang yang lebih terstruktur untuk demo.
 */
async function seedBarang(dataSource: DataSource): Promise<Barang[]> {
  const barangRepo = dataSource.getRepository(Barang);

  const barangList: Partial<Barang>[] = [
    // ATK (Alat Tulis Kantor) - Stok normal
    {
      kode_barang: 'ATK001',
      nama_barang: 'Pulpen Standard',
      kategori: 'ATK',
      stok: 50,
      satuan: 'Pcs',
      ambang_batas_kritis: 10,
      status_aktif: true,
      deskripsi: 'Pulpen tinta biru untuk keperluan sehari-hari',
    },
    {
      kode_barang: 'ATK002',
      nama_barang: 'Pensil 2B',
      kategori: 'ATK',
      stok: 100,
      satuan: 'Pcs',
      ambang_batas_kritis: 20,
      status_aktif: true,
      deskripsi: 'Pensil hitam 2B untuk menggambar dan menulis',
    },
    {
      kode_barang: 'ATK003',
      nama_barang: 'Penghapus Karet',
      kategori: 'ATK',
      stok: 30,
      satuan: 'Pcs',
      ambang_batas_kritis: 5,
      status_aktif: true,
      deskripsi: 'Penghapus karet putih standar',
    },
    {
      kode_barang: 'ATK004',
      nama_barang: 'Spidol Whiteboard',
      kategori: 'ATK',
      stok: 15,
      satuan: 'Pcs',
      ambang_batas_kritis: 5,
      status_aktif: true,
      deskripsi: 'Spidol untuk papan tulis putih berbagai warna',
    },
    {
      kode_barang: 'ATK005',
      nama_barang: 'Stapler',
      kategori: 'ATK',
      stok: 8,
      satuan: 'Pcs',
      ambang_batas_kritis: 2,
      status_aktif: true,
      deskripsi: 'Stapler ukuran sedang untuk menjilid dokumen',
    },

    // Kertas & Buku - Stok normal dan ada yang kritis
    {
      kode_barang: 'KTB001',
      nama_barang: 'Kertas HVS A4 80gr',
      kategori: 'Kertas & Buku',
      stok: 25,
      satuan: 'Rim',
      ambang_batas_kritis: 5,
      status_aktif: true,
      deskripsi: 'Kertas putih A4 80 gram untuk printer dan fotokopi',
    },
    {
      kode_barang: 'KTB002',
      nama_barang: 'Kertas HVS F4 80gr',
      kategori: 'Kertas & Buku',
      stok: 3,
      satuan: 'Rim',
      ambang_batas_kritis: 5,
      status_aktif: true,
      deskripsi: 'Kertas putih F4 80 gram untuk dokumen legal',
    },
    {
      kode_barang: 'KTB003',
      nama_barang: 'Buku Tulis 38 Lembar',
      kategori: 'Kertas & Buku',
      stok: 1,
      satuan: 'Pcs',
      ambang_batas_kritis: 10,
      status_aktif: true,
      deskripsi: 'Buku tulis bergaris 38 lembar untuk catatan',
    },
    {
      kode_barang: 'KTB004',
      nama_barang: 'Amplop Coklat A4',
      kategori: 'Kertas & Buku',
      stok: 200,
      satuan: 'Lembar',
      ambang_batas_kritis: 50,
      status_aktif: true,
      deskripsi: 'Amplop coklat ukuran A4 untuk surat dinas',
    },

    // Elektronik - Stok kritis untuk demo notifikasi
    {
      kode_barang: 'ELK001',
      nama_barang: 'Baterai AA',
      kategori: 'Elektronik',
      stok: 2,
      satuan: 'Pcs',
      ambang_batas_kritis: 10,
      status_aktif: true,
      deskripsi: 'Baterai AA alkaline untuk perangkat elektronik',
    },
    {
      kode_barang: 'ELK002',
      nama_barang: 'Catridge Printer Canon',
      kategori: 'Elektronik',
      stok: 1,
      satuan: 'Pcs',
      ambang_batas_kritis: 3,
      status_aktif: true,
      deskripsi: 'Catridge tinta hitam untuk printer Canon',
    },
    {
      kode_barang: 'ELK003',
      nama_barang: 'Mouse USB',
      kategori: 'Elektronik',
      stok: 5,
      satuan: 'Pcs',
      ambang_batas_kritis: 2,
      status_aktif: true,
      deskripsi: 'Mouse optik USB untuk komputer',
    },

    // Perlengkapan Kantor
    {
      kode_barang: 'PKT001',
      nama_barang: 'Map Plastik',
      kategori: 'Penyimpanan Arsip',
      stok: 40,
      satuan: 'Pcs',
      ambang_batas_kritis: 10,
      status_aktif: true,
      deskripsi: 'Map plastik transparan untuk menyimpan dokumen',
    },
    {
      kode_barang: 'PKT002',
      nama_barang: 'Box File',
      kategori: 'Penyimpanan Arsip',
      stok: 15,
      satuan: 'Pcs',
      ambang_batas_kritis: 5,
      status_aktif: true,
      deskripsi: 'Box file karton untuk arsip dokumen',
    },
    {
      kode_barang: 'PKT003',
      nama_barang: 'Clip Kertas',
      kategori: 'ATK',
      stok: 20,
      satuan: 'Box',
      ambang_batas_kritis: 5,
      status_aktif: true,
      deskripsi: 'Clip kertas ukuran standar untuk menjepit dokumen',
    },

    // Barang dengan stok habis untuk demo
    {
      kode_barang: 'ATK006',
      nama_barang: 'Tip-Ex',
      kategori: 'ATK',
      stok: 0,
      satuan: 'Pcs',
      ambang_batas_kritis: 5,
      status_aktif: true,
      deskripsi: 'Tip-Ex untuk mengoreksi tulisan',
    },

    // Tambahan dari data asli yang penting
    {
      kode_barang: 'ATK007',
      nama_barang: 'Binder Clip No.155',
      kategori: 'ATK',
      stok: 18,
      satuan: 'Box',
      ambang_batas_kritis: 5,
      status_aktif: true,
      deskripsi: 'Binder clip ukuran sedang untuk menjepit dokumen tebal',
    },
    {
      kode_barang: 'ATK008',
      nama_barang: 'Lem Stick',
      kategori: 'ATK',
      stok: 12,
      satuan: 'Pcs',
      ambang_batas_kritis: 3,
      status_aktif: true,
      deskripsi: 'Lem stick untuk menempel kertas',
    },
  ];

  const savedBarang = await barangRepo.save(barangRepo.create(barangList));
  console.log(
    `✅ Berhasil membuat ${savedBarang.length} barang dengan berbagai status stok`,
  );

  return savedBarang;
}

/**
 * Fungsi untuk seeding data permintaan dan detail permintaan untuk demo.
 */
async function seedPermintaan(
  dataSource: DataSource,
  users: User[],
  barangs: Barang[],
): Promise<void> {
  const permintaanRepo = dataSource.getRepository(Permintaan);
  const detailRepo = dataSource.getRepository(DetailPermintaan);

  // Ambil user berdasarkan username untuk konsistensi
  const adminUser = users.find((u) => u.username === 'admin');
  const budiUser = users.find((u) => u.username === 'budi');
  const sariUser = users.find((u) => u.username === 'sari');
  const arifkiUser = users.find((u) => u.username === 'arifki');
  const dewiyulianaUser = users.find((u) => u.username === 'dewiyuliana');

  if (!adminUser || !budiUser || !sariUser) {
    throw new Error('User admin, budi, atau sari tidak ditemukan');
  }

  // Buat tanggal untuk demo
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

  // Permintaan 1: Disetujui (Minggu lalu - Budi)
  const permintaan1 = permintaanRepo.create({
    id_user_pemohon: budiUser.id,
    tanggal_permintaan: oneWeekAgo,
    status: 'Disetujui',
    catatan: 'Permintaan ATK bulanan untuk Seksi Statistik Sosial',
    id_user_verifikator: adminUser.id,
    tanggal_verifikasi: new Date(oneWeekAgo.getTime() + 2 * 60 * 60 * 1000), // 2 jam setelah pengajuan
  });
  await permintaanRepo.save(permintaan1);

  // Detail untuk permintaan 1
  const detailPermintaan1 = [
    {
      id_permintaan: permintaan1.id,
      id_barang:
        barangs.find((b) => b.nama_barang === 'Pulpen Standard')?.id || 1,
      jumlah_diminta: 20,
      jumlah_disetujui: 20,
    },
    {
      id_permintaan: permintaan1.id,
      id_barang:
        barangs.find((b) => b.nama_barang === 'Kertas HVS A4 80gr')?.id || 6,
      jumlah_diminta: 5,
      jumlah_disetujui: 5,
    },
    {
      id_permintaan: permintaan1.id,
      id_barang: barangs.find((b) => b.nama_barang === 'Map Plastik')?.id || 13,
      jumlah_diminta: 10,
      jumlah_disetujui: 10,
    },
  ];
  await detailRepo.save(detailRepo.create(detailPermintaan1));

  // Permintaan 2: Disetujui Sebagian (3 hari lalu - Sari)
  const permintaan2 = permintaanRepo.create({
    id_user_pemohon: sariUser.id,
    tanggal_permintaan: threeDaysAgo,
    status: 'Disetujui Sebagian',
    catatan: 'Permintaan untuk kegiatan survei lapangan',
    id_user_verifikator: adminUser.id,
    tanggal_verifikasi: new Date(threeDaysAgo.getTime() + 4 * 60 * 60 * 1000),
  });
  await permintaanRepo.save(permintaan2);

  // Detail untuk permintaan 2 (sebagian disetujui)
  const detailPermintaan2 = [
    {
      id_permintaan: permintaan2.id,
      id_barang:
        barangs.find((b) => b.nama_barang === 'Buku Tulis 38 Lembar')?.id || 8,
      jumlah_diminta: 20,
      jumlah_disetujui: 1, // Stok terbatas
    },
    {
      id_permintaan: permintaan2.id,
      id_barang: barangs.find((b) => b.nama_barang === 'Pensil 2B')?.id || 2,
      jumlah_diminta: 30,
      jumlah_disetujui: 30,
    },
    {
      id_permintaan: permintaan2.id,
      id_barang:
        barangs.find((b) => b.nama_barang === 'Kertas HVS F4 80gr')?.id || 7,
      jumlah_diminta: 5,
      jumlah_disetujui: 3, // Stok kritis
    },
  ];
  await detailRepo.save(detailRepo.create(detailPermintaan2));

  // Permintaan 3: Menunggu (Kemarin - Arifki)
  const permintaan3 = permintaanRepo.create({
    id_user_pemohon: arifkiUser?.id || budiUser.id,
    tanggal_permintaan: oneDayAgo,
    status: 'Menunggu',
    catatan: 'Permintaan peralatan IT untuk maintenance komputer',
  });
  await permintaanRepo.save(permintaan3);

  // Detail untuk permintaan 3 (menunggu)
  const detailPermintaan3 = [
    {
      id_permintaan: permintaan3.id,
      id_barang: barangs.find((b) => b.nama_barang === 'Mouse USB')?.id || 12,
      jumlah_diminta: 3,
      jumlah_disetujui: 0,
    },
    {
      id_permintaan: permintaan3.id,
      id_barang:
        barangs.find((b) => b.nama_barang === 'Catridge Printer Canon')?.id ||
        11,
      jumlah_diminta: 2,
      jumlah_disetujui: 0,
    },
  ];
  await detailRepo.save(detailRepo.create(detailPermintaan3));

  // Permintaan 4: Menunggu (Hari ini - Dewi)
  const permintaan4 = permintaanRepo.create({
    id_user_pemohon: dewiyulianaUser?.id || sariUser.id,
    tanggal_permintaan: now,
    status: 'Menunggu',
    catatan: 'Permintaan ATK untuk kegiatan rapat koordinasi',
  });
  await permintaanRepo.save(permintaan4);

  // Detail untuk permintaan 4
  const detailPermintaan4 = [
    {
      id_permintaan: permintaan4.id,
      id_barang:
        barangs.find((b) => b.nama_barang === 'Spidol Whiteboard')?.id || 4,
      jumlah_diminta: 6,
      jumlah_disetujui: 0,
    },
    {
      id_permintaan: permintaan4.id,
      id_barang:
        barangs.find((b) => b.nama_barang === 'Amplop Coklat A4')?.id || 9,
      jumlah_diminta: 50,
      jumlah_disetujui: 0,
    },
    {
      id_permintaan: permintaan4.id,
      id_barang: barangs.find((b) => b.nama_barang === 'Box File')?.id || 14,
      jumlah_diminta: 5,
      jumlah_disetujui: 0,
    },
  ];
  await detailRepo.save(detailRepo.create(detailPermintaan4));

  // Permintaan 5: Ditolak (2 hari lalu - Budi)
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const permintaan5 = permintaanRepo.create({
    id_user_pemohon: budiUser.id,
    tanggal_permintaan: twoDaysAgo,
    status: 'Ditolak',
    catatan: 'Permintaan barang elektronik dalam jumlah besar',
    id_user_verifikator: adminUser.id,
    tanggal_verifikasi: new Date(twoDaysAgo.getTime() + 3 * 60 * 60 * 1000),
  });
  await permintaanRepo.save(permintaan5);

  // Detail untuk permintaan 5 (ditolak)
  const detailPermintaan5 = [
    {
      id_permintaan: permintaan5.id,
      id_barang: barangs.find((b) => b.nama_barang === 'Mouse USB')?.id || 12,
      jumlah_diminta: 20,
      jumlah_disetujui: 0,
    },
    {
      id_permintaan: permintaan5.id,
      id_barang: barangs.find((b) => b.nama_barang === 'Baterai AA')?.id || 10,
      jumlah_diminta: 50,
      jumlah_disetujui: 0,
    },
  ];
  await detailRepo.save(detailRepo.create(detailPermintaan5));

  console.log('✅ Berhasil membuat data permintaan demo:');
  console.log('   - 1 Permintaan Disetujui (Budi - 1 minggu lalu)');
  console.log('   - 1 Permintaan Disetujui Sebagian (Sari - 3 hari lalu)');
  console.log('   - 2 Permintaan Menunggu (Arifki & Dewi)');
  console.log('   - 1 Permintaan Ditolak (Budi - 2 hari lalu)');
  console.log('   - Total detail permintaan: 12 items');
}

/**
 * Fungsi utama untuk menjalankan proses seeding dan menangani error jika terjadi.
 */
seed().catch((err) => {
  console.error('❌ Seeding gagal:', err);
  process.exit(1);
});
