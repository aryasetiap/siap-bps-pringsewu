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
      foto: 'https://ui-avatars.com/api/?name=Admin+SIAP', // contoh foto profil
    });
    await userRepo.save(admin);
    console.log('Admin user created');
  } else {
    // Update password admin ke 'admin123' agar selalu sinkron dengan test
    adminExist.password = await bcrypt.hash('admin123', 10);
    adminExist.status_aktif = true;
    adminExist.foto =
      adminExist.foto || 'https://ui-avatars.com/api/?name=Admin+SIAP';
    await userRepo.save(adminExist);
    console.log('Admin user already exists, password reset to admin123');
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
      foto: 'https://ui-avatars.com/api/?name=Pegawai+Contoh', // contoh foto profil
    });
    await userRepo.save(pegawai);
    console.log('Pegawai user created');
  } else {
    pegawaiExist.foto =
      pegawaiExist.foto || 'https://ui-avatars.com/api/?name=Pegawai+Contoh';
    await userRepo.save(pegawaiExist);
    console.log('Pegawai user already exists');
  }

  // Cek dan insert user pegawai1 (untuk keperluan e2e test)
  const pegawai1Exist = await userRepo.findOneBy({ username: 'pegawai1' });
  if (!pegawai1Exist) {
    const pegawai1 = userRepo.create({
      nama: 'Pegawai Satu',
      username: 'pegawai1',
      password: await bcrypt.hash('pegawai123', 10),
      role: 'pegawai',
      status_aktif: true,
      foto: 'https://ui-avatars.com/api/?name=Pegawai+Satu',
    });
    await userRepo.save(pegawai1);
    console.log('Pegawai1 user created');
  } else {
    pegawai1Exist.password = await bcrypt.hash('pegawai123', 10);
    pegawai1Exist.status_aktif = true;
    pegawai1Exist.foto =
      pegawai1Exist.foto || 'https://ui-avatars.com/api/?name=Pegawai+Satu';
    await userRepo.save(pegawai1Exist);
    console.log('Pegawai1 user already exists, password reset to pegawai123');
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

  // Tambahkan barang kritis untuk keperluan test
  const kritisExist = await barangRepo.findOneBy({ kode_barang: 'KRITIS01' });
  if (!kritisExist) {
    const barangKritis = barangRepo.create({
      kode_barang: 'KRITIS01',
      nama_barang: 'Spidol Kritis',
      deskripsi: 'Spidol dengan stok kritis',
      satuan: 'pcs',
      stok: 2,
      ambang_batas_kritis: 5,
      status_aktif: true,
    });
    await barangRepo.save(barangKritis);
    console.log('Barang kritis created');
  } else {
    console.log('Barang kritis already exists');
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
