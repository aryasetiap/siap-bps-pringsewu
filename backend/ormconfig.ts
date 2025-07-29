import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

/**
 * Melakukan inisialisasi variabel lingkungan dari file .env.
 * Fungsi ini tidak menerima parameter dan tidak mengembalikan nilai.
 */
dotenv.config();

/**
 * Membuat instance DataSource untuk koneksi ke database PostgreSQL.
 *
 * Tujuan:
 *   Mengatur konfigurasi koneksi database menggunakan variabel lingkungan.
 *
 * Parameter:
 *   - Tidak ada parameter langsung, namun menggunakan variabel lingkungan:
 *     - DB_HOST: Host database
 *     - DB_PORT: Port database
 *     - DB_USERNAME: Username database
 *     - DB_PASSWORD: Password database
 *     - DB_DATABASE: Nama database
 *
 * Nilai Kembali:
 *   - Instance DataSource yang telah dikonfigurasi.
 */
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
