# SIAP BPS Pringsewu

Sistem Aplikasi Pengelolaan Aset & Persediaan (SIAP) adalah aplikasi berbasis web untuk mendukung digitalisasi proses pengelolaan barang persediaan di BPS Kabupaten Pringsewu. Sistem ini dibangun dengan arsitektur **API-first** menggunakan **Laravel** (backend) dan **React.js** (frontend).

## Fitur Utama (MVP)

- **Manajemen Data Barang & Pengguna** (CRUD)
- **Manajemen Stok Otomatis** (penambahan & pengurangan stok)
- **Alur Permintaan & Verifikasi Barang** (multi-item, status, catatan)
- **Dashboard Interaktif Admin** (statistik, grafik, notifikasi stok kritis)
- **Pencarian & Filter Data**
- **Riwayat & Pelacakan Permintaan**
- **Cetak Bukti Permintaan ke PDF**
- **Laporan Periodik Penggunaan Barang**

## Teknologi

- **Backend:** Laravel (PHP), Sanctum (API Auth), Eloquent ORM, PostgreSQL
- **Frontend:** React.js, Tailwind CSS
- **PDF Generator:** barryvdh/laravel-dompdf

## Struktur Database (Entitas Utama)

- **User:** Admin & Pegawai, role-based, autentikasi aman
- **Barang:** Data master barang, stok, ambang batas kritis
- **Permintaan:** Header permintaan barang, status, catatan
- **Detail_Permintaan:** Item permintaan, jumlah diminta/disetujui

## Alur Pengembangan (Sprint 5 Hari)

1. **Hari 1:** Setup proyek, database, autentikasi, CRUD barang (API)
2. **Hari 2:** CRUD barang lanjut, penambahan stok, UI dasar barang & dashboard
3. **Hari 3:** Proses permintaan barang (pegawai), riwayat permintaan
4. **Hari 4:** Verifikasi permintaan (admin), pengurangan stok, dashboard dinamis
5. **Hari 5:** Cetak PDF, laporan periodik, polish, staging/UAT

## Instalasi & Penggunaan

1. **Clone repo:**  
   `git clone <repo-url>`
2. **Setup Backend:**
   - `cd backend`
   - `composer install`
   - Copy `.env.example` ke `.env`, atur koneksi database
   - `php artisan migrate --seed`
   - `php artisan serve`
3. **Setup Frontend:**
   - `cd frontend`
   - `npm install`
   - `npm start`
4. **Akses aplikasi:**
   - Backend API: `http://localhost:8000/api`
   - Frontend: `http://localhost:3000`

## Dokumentasi Lengkap

Lihat [SDLC_SIAP.md](./SDLC_SIAP.md) untuk dokumen analisis kebutuhan, desain, dan timeline pengembangan.

---

**Developer:** Arya Setia Pratama  
**Klien:** Pengelola Barang Persediaan BPS Kabupaten Pringsewu  
**Versi:** 1.0
