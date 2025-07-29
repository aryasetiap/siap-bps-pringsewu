import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { User } from './entities/user.entity';
import { Barang } from './entities/barang.entity';
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

  await userRepo.save(
    userRepo.create({
      nama: 'Admin SIAP',
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      unit_kerja: 'Kepala Kantor',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Admin+SIAP',
    }),
  );

  const pegawaiList = [
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
  ];
  await userRepo.save(userRepo.create(pegawaiList));

  const barangRepo = dataSource.getRepository(Barang);
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
  ];
  await barangRepo.save(barangRepo.create(barangList));

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
