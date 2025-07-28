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
- [ ] Logika pengurangan stok otomatis setelah verifikasi
- [ ] Validasi stok tidak minus
- [ ] Catatan verifikasi (opsional)

### 6. Dashboard & Monitoring (Admin)

- [ ] Endpoint statistik dashboard (jumlah barang, permintaan tertunda, barang kritis)
- [ ] Endpoint grafik tren permintaan bulanan
- [ ] Endpoint notifikasi stok kritis

### 7. Pelaporan & Ekspor PDF

- [ ] Endpoint generate PDF bukti permintaan (pdfmake/node-pdfkit)
- [ ] Endpoint laporan periodik penggunaan barang (filter tanggal, ekspor PDF)

### 8. Testing & Dokumentasi

- [ ] Unit test fungsi utama (stok, verifikasi, autentikasi)
- [ ] Integration test API utama
- [ ] Dokumentasi API (endpoint, request/response, error)
- [ ] Refactor & code review

### 9. Deployment & Maintenance

- [ ] Setup server staging/production
- [ ] Deployment aplikasi (git pull, npm install, migration, dsb)
- [ ] Migrasi data awal ke produksi
- [ ] Backup otomatis & monitoring
- [ ] Support bugfix & update pasca go-live

---

## FRONTEND (FE) - React.js

### 1. Setup & Fondasi Proyek

- [ ] Inisialisasi project React.js baru
- [ ] Setup struktur folder, routing dasar (React Router)
- [ ] Instalasi dependensi utama (axios, tailwindcss, dsb)
- [ ] Setup koneksi ke API backend (axios instance)
- [ ] Setup state management (jika perlu, misal context/redux)

### 2. Modul Autentikasi & User

- [ ] Halaman login (Admin & Pegawai)
- [ ] Implementasi session/token management
- [ ] Halaman profil user (lihat & edit data diri, ubah password)
- [ ] Proteksi route sesuai role

### 3. Dashboard Admin

- [ ] Halaman dashboard: widget statistik, grafik tren permintaan, notifikasi stok kritis
- [ ] Komponen daftar permintaan tertunda

### 4. Manajemen Barang (Admin)

- [ ] Halaman daftar barang (tabel, search, filter)
- [ ] Form tambah/edit barang (modal)
- [ ] Fitur penambahan stok barang
- [ ] Notifikasi stok kritis visual

### 5. Manajemen Pengguna (Admin)

- [ ] Halaman daftar user (tabel)
- [ ] Form tambah/edit/nonaktifkan user

### 6. Permintaan Barang (Pegawai)

- [ ] Halaman daftar barang (pegawai): search, filter, info stok
- [ ] Form pengajuan permintaan (multi-item, pilih barang, jumlah, satuan)
- [ ] Validasi stok real-time di form

### 7. Riwayat Permintaan (Pegawai)

- [ ] Halaman riwayat permintaan (tabel, status, detail)
- [ ] Halaman detail permintaan (barang, jumlah, status, catatan)

### 8. Verifikasi Permintaan (Admin)

- [ ] Halaman daftar permintaan masuk (tabel)
- [ ] Halaman detail permintaan (item, jumlah diminta, stok tersedia)
- [ ] Form verifikasi (setuju/sebagian/tolak, jumlah disetujui, catatan)

### 9. Laporan & Cetak PDF

- [ ] Halaman laporan periodik (filter tanggal, rekap penggunaan barang)
- [ ] Tombol ekspor/cetak PDF laporan
- [ ] Halaman cetak bukti permintaan (preview, cetak PDF)

### 10. Notifikasi & Error Handling

- [ ] Komponen notifikasi (stok kritis, permintaan baru, dsb)
- [ ] Halaman error/forbidden/404

### 11. Testing & Polish

- [ ] Uji integrasi API (login, CRUD, permintaan, dsb)
- [ ] Uji UI/UX (responsif, mobile friendly)
- [ ] Refactor & code review

### 12. Deployment & Maintenance

- [ ] Build production FE
- [ ] Deploy ke server (staging/production)
- [ ] Uji end-to-end bersama backend
- [ ] Support bugfix & update pasca go-live

---

**Catatan:**

- Setiap task dapat diberi checklist [ ] dan catatan progres/tanggal.
- Tambahkan sub-task jika diperlukan untuk detail lebih lanjut.
- Update secara berkala untuk monitoring
