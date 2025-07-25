import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { User } from './entities/user.entity';
import { Barang } from './entities/barang.entity';
import ormconfig from '../ormconfig';

dotenv.config();

async function seed() {
  const dataSource = await ormconfig.initialize();

  // Cek dan insert user admin
  const userRepo = dataSource.getRepository(User);
  const adminExist = await userRepo.findOneBy({ username: 'admin' });
  if (!adminExist) {
    const admin = userRepo.create({
      nama: 'Admin SIAP',
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      status_aktif: true,
    });
    await userRepo.save(admin);
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }

  // Cek dan insert user pegawai
  const pegawaiExist = await userRepo.findOneBy({ username: 'pegawai' });
  if (!pegawaiExist) {
    const pegawai = userRepo.create({
      nama: 'Pegawai Contoh',
      username: 'pegawai',
      password: await bcrypt.hash('pegawai123', 10),
      role: 'pegawai',
      status_aktif: true,
    });
    await userRepo.save(pegawai);
    console.log('Pegawai user created');
  } else {
    console.log('Pegawai user already exists');
  }

  // Cek dan insert barang contoh
  const barangRepo = dataSource.getRepository(Barang);
  const barangExist = await barangRepo.findOneBy({ kode_barang: 'BRG001' });
  if (!barangExist) {
    const barang = barangRepo.create({
      kode_barang: 'BRG001',
      nama_barang: 'Kertas A4',
      deskripsi: 'Kertas HVS ukuran A4 80gsm',
      satuan: 'rim',
      stok: 100,
      ambang_batas_kritis: 10,
      status_aktif: true,
    });
    await barangRepo.save(barang);
    console.log('Barang contoh created');
  } else {
    console.log('Barang contoh already exists');
  }

  await dataSource.destroy();
}

seed()
  .then(() => {
    console.log('Seeding selesai');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding gagal:', err);
    process.exit(1);
  });
