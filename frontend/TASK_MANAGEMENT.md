# TASK MANAGEMENT - SIAP BPS Pringsewu

Dokumentasi tahapan kerja detail untuk monitoring dan catatan progres proyek.  
**Pisahkan task Backend (BE) dan Frontend (FE) untuk kemudahan tracking.**

---

## BACKEND (BE) - NestJS API

### 1. Setup & Fondasi Proyek

- [x] Inisialisasi project NestJS baru
- [x] Setup repository Git & struktur folder
  > Repo Git diinisialisasi di root siap-bps-pringsewu, backend sebagai subfolder
- [x] Konfigurasi environment (.env) & koneksi database PostgreSQL
- [x] Instalasi dependensi utama (TypeORM, JWT, pdfmake/node-pdfkit, dsb)
- [x] Inisialisasi migrasi database (users, barang, permintaan, detail_permintaan)
- [x] Seeder data awal (admin, pegawai, barang contoh)
- [x] Setup autentikasi (login/logout, hashing password, role-based)
- [x] Middleware otorisasi (admin/pegawai)

### 2. Modul User & Autentikasi

- [x] CRUD User (Admin): tambah, edit, nonaktifkan user
- [x] Endpoint login & logout (JWT)
- [x] Endpoint profil user (lihat & edit data diri, ubah password)
- [x] Validasi & proteksi endpoint sesuai role

### 3. Modul Barang & Stok

- [x] CRUD Barang (Admin): tambah, edit, hapus, nonaktifkan
- [x] Endpoint penambahan stok barang
- [x] Validasi input barang & stok
- [x] Fitur pencarian & filter barang (API)
- [x] Notifikasi stok kritis (API response)

### 4. Modul Permintaan Barang (Pegawai)

- [x] Endpoint pengajuan permintaan barang (multi-item)
- [x] Validasi stok tersedia sebelum permintaan
- [x] Simpan permintaan & detail_permintaan
- [x] Endpoint riwayat permintaan pegawai

### 5. Modul Verifikasi Permintaan (Admin)

- [x] Endpoint daftar permintaan masuk (status: Menunggu)
- [x] Endpoint detail permintaan (lihat item, jumlah, stok)
- [x] Endpoint verifikasi permintaan (setuju, setuju sebagian, tolak)
- [x] Logika pengurangan stok otomatis setelah verifikasi
- [x] Validasi stok tidak minus
- [x] Catatan verifikasi (opsional)

### 6. Dashboard & Monitoring (Admin)

- [x] Endpoint statistik dashboard (jumlah barang, permintaan tertunda, barang kritis)
- [x] Endpoint grafik tren permintaan bulanan
- [x] Endpoint notifikasi stok kritis

### 7. Pelaporan & Ekspor PDF

- [x] Endpoint generate PDF bukti permintaan (pdfmake/node-pdfkit)
- [x] Endpoint laporan periodik penggunaan barang (filter tanggal, ekspor PDF)
- [x] Endpoint generate PDF laporan periodik penggunaan barang
  > Filter tanggal, rekap penggunaan, ekspor PDF

### 8. Testing & Dokumentasi

- [x] Unit test dan E2E Test fungsi utama
- [x] Integration test API utama
- [x] Dokumentasi API (endpoint, request/response, error)
- [x] Refactor & code review

### 9. Deployment & Maintenance

- [ ] Setup server staging/production
- [ ] Deployment aplikasi (git pull, npm install, migration, dsb)
- [ ] Migrasi data awal ke produksi
- [ ] Backup otomatis & monitoring
- [ ] Support bugfix & update pasca go-live

---

## FRONTEND (FE) - React.js

### 1. Audit & Refactor

- [x] Audit seluruh komponen yang sudah ada (struktur, style, konsistensi)
- [x] Refactor komponen agar siap integrasi API (pisahkan logic & UI)

### 2. Penyelesaian Fitur Utama (UI/UX)

#### Pegawai

- [x] Halaman daftar barang (pegawai): tabel, search, filter, info stok
- [x] Form pengajuan permintaan barang (multi-item, pilih barang, jumlah, satuan)
- [x] Halaman riwayat permintaan pegawai (tabel, status, detail)
- [x] Halaman detail permintaan (pegawai)

#### Admin

- [x] Halaman laporan periodik penggunaan barang (filter tanggal, rekap, ekspor PDF)
- [x] Halaman cetak bukti permintaan (preview, tombol cetak PDF)

#### Umum

- [x] Halaman profil user (lihat/edit data diri, ubah password)
- [x] Halaman error/forbidden/404
- [x] Komponen notifikasi visual (stok kritis, permintaan baru, dsb)

### 3. Integrasi dengan Backend

- [ ] Ganti seluruh mock data dengan API call ke endpoint backend
- [ ] Implementasi loading, error handling, dan notifikasi pada setiap aksi
- [ ] Pastikan autentikasi JWT dan proteksi role berjalan pada setiap request
  - [x] Buat dan konfigurasi `src/services/api.js` (axios instance + interceptor)
  - [x] Update seluruh service di `services` untuk pakai axios instance
  - [x] Refactor `AdminDashboard.jsx` untuk ambil data dari API
  - [x] Refactor `ManajemenBarang.jsx` untuk CRUD barang via API
  - [x] Refactor `UserManagement.jsx` untuk CRUD user via API
  - [x] Refactor `RequestVerification.jsx` untuk ambil dan update permintaan via API
  - [x] Refactor `LaporanPeriodik.jsx` untuk ambil dan ekspor laporan via API
  - [ ] Refactor `EmployeeRequest.jsx` untuk submit permintaan via API
  - [ ] Refactor `EmployeeHistory.jsx` untuk ambil riwayat permintaan via API
  - [ ] Refactor `ProfilePage.jsx` untuk update profil via API
  - [ ] Refactor `LoginPage.jsx` untuk login via API & error handling
  - [ ] Refactor `CetakBuktiPermintaan.jsx` untuk ambil detail & cetak PDF via API
  - [ ] Review `Error404.jsx` dan `Forbidden.jsx` untuk konsistensi akses/route
  - [ ] Pastikan semua aksi ada loading & error handling
  - [ ] Pastikan semua route terproteksi sesuai role & token
  - [ ] Implementasi global error handling (token expired, dsb)
  - [ ] Review dan refactor komponen agar logic & UI terpisah

### 4. Testing & Polish

- [ ] Uji seluruh alur kerja end-to-end (login, CRUD, permintaan, verifikasi, laporan, PDF)
- [ ] Uji UI/UX (responsif, mobile friendly, konsistensi style)
- [ ] Refactor kode, perbaiki bug, dan lakukan code review

### 5. Deployment & Maintenance

- [ ] Build production FE
- [ ] Deploy ke server (staging/production)
- [ ] Uji end-to-end bersama backend
- [ ] Support bugfix & update pasca go-live

---

**Catatan:**

- Setiap task dapat diberi checklist [ ] dan catatan progres/tanggal.
- Tambahkan sub-task jika diperlukan untuk detail lebih lanjut.
- Update secara berkala untuk monitoring
