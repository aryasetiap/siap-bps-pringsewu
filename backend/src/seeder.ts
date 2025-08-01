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
 * Melakukan proses seeding data awal ke database.
 *
 * Fungsi ini akan:
 * 1. Menginisialisasi koneksi database.
 * 2. Mengosongkan tabel detail_permintaan, permintaan, barang, dan users.
 * 3. Menambahkan data user (admin dan pegawai).
 * 4. Menambahkan data barang.
 * 5. Menutup koneksi database setelah selesai.
 *
 * @returns {Promise<void>} Tidak mengembalikan nilai apapun.
 */
async function seed(): Promise<void> {
  const dataSource = await ormconfig.initialize();

  await dataSource.query(`
    TRUNCATE TABLE "detail_permintaan", "permintaan", "barang", "users" RESTART IDENTITY CASCADE
  `);

  const userRepo = dataSource.getRepository(User);
  const barangRepo = dataSource.getRepository(Barang);
  const permintaanRepo = dataSource.getRepository(Permintaan);
  const detailPermintaanRepo = dataSource.getRepository(DetailPermintaan);

  // 1. User
  const users = [
    {
      nama: 'Admin SIAP',
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin' as const,
      unit_kerja: 'Kepala Kantor',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Admin+SIAP',
    },
    {
      nama: 'Budi Santoso',
      username: 'budi',
      password: await bcrypt.hash('budi123', 10),
      role: 'pegawai' as const,
      unit_kerja: 'Statistik Produksi',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Budi+Santoso',
    },
    {
      nama: 'Siti Aminah',
      username: 'siti',
      password: await bcrypt.hash('siti123', 10),
      role: 'pegawai' as const,
      unit_kerja: 'Statistik Sosial',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Siti+Aminah',
    },
    {
      nama: 'Rudi Hartono',
      username: 'rudi',
      password: await bcrypt.hash('rudi123', 10),
      role: 'pegawai' as const,
      unit_kerja: 'Bagian Umum',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Rudi+Hartono',
    },
    {
      nama: 'Dewi Lestari',
      username: 'dewi',
      password: await bcrypt.hash('dewi123', 10),
      role: 'pegawai' as const,
      unit_kerja: 'Statistik Distribusi',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Dewi+Lestari',
    },
  ];
  const savedUsers = await userRepo.save(userRepo.create(users));

  // 2. Barang
  const kategoriList = ['ATK', 'Elektronik', 'Konsumsi', 'Dokumen', 'Lainnya'];
  const barangList: Partial<Barang>[] = []; // <-- tambahkan tipe Partial<Barang>
  for (let i = 1; i <= 50; i++) {
    barangList.push({
      kode_barang: `BRG${i.toString().padStart(3, '0')}`,
      nama_barang: `Barang Contoh ${i}`,
      deskripsi: `Deskripsi barang contoh ke-${i}`,
      satuan: ['pcs', 'box', 'pak', 'rim', 'unit'][i % 5],
      stok: Math.floor(Math.random() * 100),
      ambang_batas_kritis: Math.floor(Math.random() * 10) + 1,
      status_aktif: true,
      foto: undefined,
      kategori: kategoriList[i % kategoriList.length],
    });
  }
  const savedBarang = await barangRepo.save(barangRepo.create(barangList));

  // 3. Permintaan & Detail Permintaan
  let permintaanArr: Partial<Permintaan>[] = []; // <-- tambahkan tipe Partial<Permintaan>
  let detailArr: Partial<DetailPermintaan>[] = []; // <-- tambahkan tipe Partial<DetailPermintaan>
  const statusArr: (
    | 'Menunggu'
    | 'Disetujui'
    | 'Ditolak'
    | 'Disetujui Sebagian'
  )[] = ['Menunggu', 'Disetujui', 'Ditolak', 'Disetujui Sebagian'];
  for (let i = 0; i < 100; i++) {
    const user = savedUsers[i % savedUsers.length];
    const status = statusArr[i % statusArr.length];

    // Generate tanggal permintaan acak dalam 1 tahun terakhir (Agustus 2024 - Juli 2025)
    const startDate = new Date('2024-08-01T00:00:00Z').getTime();
    const endDate = new Date('2025-07-31T23:59:59Z').getTime();
    const randomTime = startDate + Math.random() * (endDate - startDate);
    const tanggal_permintaan = new Date(randomTime);

    const permintaan: Partial<Permintaan> = {
      id_user_pemohon: user.id,
      tanggal_permintaan,
      status,
      catatan: status === 'Ditolak' ? 'Stok tidak cukup' : '',
    };
    permintaanArr.push(permintaan);
  }
  const savedPermintaan = await permintaanRepo.save(
    permintaanRepo.create(permintaanArr),
  );

  // Detail permintaan (multi-item per permintaan)
  for (let i = 0; i < savedPermintaan.length; i++) {
    const permintaan = savedPermintaan[i];
    const jumlahItem = Math.floor(Math.random() * 4) + 1;
    for (let j = 0; j < jumlahItem; j++) {
      const barang = savedBarang[(i + j) % savedBarang.length];
      const detail: Partial<DetailPermintaan> = {
        id_permintaan: permintaan.id,
        id_barang: barang.id,
        jumlah_diminta: Math.floor(Math.random() * 5) + 1,
        jumlah_disetujui:
          permintaan.status === 'Disetujui'
            ? Math.floor(Math.random() * 5) + 1
            : 0,
      };
      detailArr.push(detail);
    }
  }
  await detailPermintaanRepo.save(detailPermintaanRepo.create(detailArr));

  await dataSource.destroy();
  console.log('Seeding selesai');
}

/**
 * Menjalankan fungsi seed dan menangani error jika terjadi.
 *
 * @returns {void}
 */
seed().catch((err) => {
  console.error('Seeding gagal:', err);
  process.exit(1);
});
