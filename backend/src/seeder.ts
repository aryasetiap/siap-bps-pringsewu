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
  const barangList = [
    {
      kode_barang: 'BRG001',
      nama_barang: 'Kertas A4 80gsm',
      deskripsi: 'Kertas HVS ukuran A4, 80gsm, putih',
      satuan: 'rim',
      stok: 50,
      ambang_batas_kritis: 10,
      status_aktif: true,
    },
    {
      kode_barang: 'BRG002',
      nama_barang: 'Spidol Whiteboard',
      deskripsi: 'Spidol untuk papan tulis putih',
      satuan: 'pcs',
      stok: 20,
      ambang_batas_kritis: 5,
      status_aktif: true,
    },
    {
      kode_barang: 'BRG003',
      nama_barang: 'Toner Printer HP',
      deskripsi: 'Toner printer HP LaserJet',
      satuan: 'pcs',
      stok: 5,
      ambang_batas_kritis: 2,
      status_aktif: true,
    },
    {
      kode_barang: 'BRG004',
      nama_barang: 'Map Folder Plastik',
      deskripsi: 'Map plastik untuk dokumen',
      satuan: 'box',
      stok: 15,
      ambang_batas_kritis: 3,
      status_aktif: true,
    },
    {
      kode_barang: 'KRITIS01',
      nama_barang: 'Pulpen Biru',
      deskripsi: 'Pulpen tinta biru',
      satuan: 'box',
      stok: 1,
      ambang_batas_kritis: 5,
      status_aktif: true,
    },
    {
      kode_barang: 'BRG005',
      nama_barang: 'Amplop Coklat',
      deskripsi: 'Amplop coklat besar',
      satuan: 'pak',
      stok: 8,
      ambang_batas_kritis: 3,
      status_aktif: true,
    },
    {
      kode_barang: 'BRG006',
      nama_barang: 'Stempel',
      deskripsi: 'Stempel kantor',
      satuan: 'pcs',
      stok: 2,
      ambang_batas_kritis: 2,
      status_aktif: true,
    },
  ];
  const savedBarang = await barangRepo.save(barangRepo.create(barangList));

  // 3. Permintaan & Detail Permintaan
  const bulanList = [
    '2024-07',
    '2024-08',
    '2024-09',
    '2024-10',
    '2024-11',
    '2024-12',
    '2025-01',
    '2025-02',
    '2025-03',
    '2025-04',
    '2025-05',
    '2025-06',
  ];
  let permintaanArr: Permintaan[] = [];
  let detailArr: DetailPermintaan[] = [];

  for (let i = 0; i < bulanList.length; i++) {
    for (let j = 0; j < 2; j++) {
      const user = savedUsers[(i + j) % savedUsers.length];
      const barang = savedBarang[(i + j) % savedBarang.length];
      const tanggal = `${bulanList[i]}-0${j + 1}T08:00:00.000Z`;

      // Status harus sesuai enum di entity
      const status =
        j % 3 === 0 ? 'Menunggu' : j % 3 === 1 ? 'Disetujui' : 'Ditolak';

      const permintaan = permintaanRepo.create({
        id_user_pemohon: user.id,
        tanggal_permintaan: tanggal,
        status,
        catatan: status === 'Ditolak' ? 'Stok tidak cukup' : '',
      });
      permintaanArr.push(permintaan);
    }
  }
  const savedPermintaan = await permintaanRepo.save(permintaanArr);

  // Detail permintaan
  for (let i = 0; i < savedPermintaan.length; i++) {
    const barang = savedBarang[i % savedBarang.length];
    const detail = detailPermintaanRepo.create({
      id_permintaan: savedPermintaan[i].id,
      id_barang: barang.id,
      jumlah_diminta: 2 + (i % 2),
      jumlah_disetujui: 0,
    });
    detailArr.push(detail);
  }
  await detailPermintaanRepo.save(detailArr);

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
