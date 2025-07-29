# 🚀 SIAP BPS Pringsewu - Backend

**Sistem Aplikasi Pengelolaan Aset & Persediaan (SIAP)**  
Backend API untuk digitalisasi pengelolaan barang persediaan di BPS Kabupaten Pringsewu.  
Dibangun dengan [NestJS](https://nestjs.com/), [TypeORM](https://typeorm.io/), dan PostgreSQL.

---

## ✨ Fitur Unggulan

- **🔐 Manajemen User & Autentikasi**  
  CRUD user (admin/pegawai), login/logout JWT, role-based access, update profil, upload foto.
- **📦 Manajemen Barang**  
  CRUD barang, tambah stok, filter stok kritis, soft delete, notifikasi stok kritis.
- **📝 Permintaan Barang**  
  Pengajuan multi-item (pegawai), riwayat & detail permintaan.
- **✅ Verifikasi Permintaan**  
  Verifikasi (admin): setuju/sebagian/tolak, pengurangan stok otomatis, validasi stok.
- **📊 Dashboard & Monitoring**  
  Statistik, grafik tren bulanan, notifikasi stok kritis.
- **🖨️ Pelaporan & PDF**  
  Cetak bukti permintaan & laporan periodik (PDF, pdfmake).
- **🧪 Testing & Dokumentasi**  
  Unit test, e2e test, dokumentasi endpoint lengkap.

---

## ⚙️ Stack Teknologi

- **Backend:** NestJS (Node.js), TypeORM, PostgreSQL, JWT Auth
- **PDF Generator:** pdfmake
- **Testing:** Jest, Supertest

---

## 🚦 Cara Instalasi & Menjalankan

1. **Clone repository:**
   ```sh
   git clone <repo-url>
   cd backend
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Konfigurasi environment:**
   - Copy `.env.example` ke `.env` dan sesuaikan (lihat contoh di repo)
4. **Migrasi & seeder database:**
   ```sh
   npm run migration:run
   npm run seed
   ```
5. **Jalankan server (development):**
   ```sh
   npm run start:dev
   ```
   API dapat diakses di: [http://localhost:3001](http://localhost:3001)

---

## 🛠️ Script Penting

| Script                  | Fungsi                         |
| ----------------------- | ------------------------------ |
| `npm run start:dev`     | Jalankan server development    |
| `npm run build`         | Build project ke folder `dist` |
| `npm run seed`          | Isi database dengan data awal  |
| `npm run test`          | Jalankan unit test             |
| `npm run test:e2e`      | Jalankan end-to-end test       |
| `npm run migration:run` | Jalankan migrasi database      |

---

## 📑 Dokumentasi API

- **ENDPOINT_API.md**  
  Penjelasan lengkap endpoint, request/response, error handling, proteksi, dan contoh penggunaan.

---

## 👨‍💻 Developer

**Arya Setia Pratama**  
[GitHub: aryasetiap](https://github.com/aryasetiap)  
WhatsApp: 085669644533

---

> **Kontribusi, bug report, dan saran sangat terbuka!**  
> Jangan ragu untuk membuka issue atau pull request 🚀
