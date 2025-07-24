# Dokumen SDLC: Sistem Aplikasi Pengelolaan Aset & Persediaan (SIAP)

**Versi Dokumen**: 2.0  
**Tanggal**: 24 Juli 2025  
**Klien**: Pengelola Barang Persediaan BPS Kabupaten Pringsewu  
**Developer**: Arya Setia Pratama

---

## 1. Tahap Perencanaan (Planning Phase)

### 1.1. Latar Belakang

Proses pengelolaan barang persediaan di BPS Kabupaten Pringsewu saat ini yang bersifat manual telah menimbulkan berbagai inefisiensi operasional. Tantangan utamanya meliputi kurangnya visibilitas stok secara real-time, yang berisiko pada kehabisan barang krusial, proses permintaan dan persetujuan yang lambat dan birokratis, serta rendahnya akuntabilitas akibat potensi kesalahan pencatatan manual. Untuk mentransformasi proses ini, diperlukan sebuah **Sistem Aplikasi Pengelolaan Aset & Persediaan (SIAP)** yang terkomputerisasi, bertujuan untuk mengotomatisasi alur kerja, meningkatkan efisiensi, dan menyediakan data yang akurat untuk pengambilan keputusan.

### 1.2. Tujuan Proyek (Project Goals - SMART)

Sistem ini bertujuan untuk:

- **Specific**: Mengembangkan platform terpusat untuk monitoring stok, alur pengajuan & verifikasi permintaan, serta pelaporan penggunaan barang persediaan.
- **Measurable**:
  - Mengurangi waktu rata-rata proses permintaan (dari pengajuan hingga keputusan) dari ±1 hari kerja menjadi **maksimal 15 menit**.
  - Menurunkan potensi kesalahan pencatatan stok hingga **mendekati 0%**.
  - Menyediakan data stok yang dapat diakses dalam **kurang dari 5 detik**.
- **Achievable**: Dibangun menggunakan tumpukan teknologi modern (Laravel & React) yang memungkinkan pengembangan cepat dan iteratif untuk mencapai target MVP.
- **Relevant**: Mendukung **efisiensi operasional, transparansi, akuntabilitas**, dan **pengambilan keputusan berbasis data** dalam pengelolaan aset BPS Kabupaten Pringsewu.
- **Time-bound**: Minimum Viable Product (MVP) dengan fitur inti ditargetkan siap untuk UAT dalam **satu sprint pengembangan intensif selama 5 hari kerja** (24 Juli - 28 Juli 2025).

### 1.3. Ruang Lingkup (Scope)

#### Masuk dalam Lingkup (In-Scope) - Fitur MVP Unggulan

- **Manajemen Data Induk**: CRUD penuh untuk data barang dan data pengguna (Admin & Pegawai).
- **Manajemen Stok Cerdas**: Fitur penambahan stok dan pengurangan stok otomatis setelah verifikasi.
- **Alur Permintaan Digital**: Proses pengajuan permintaan barang oleh pegawai dengan validasi stok real-time.
- **Alur Verifikasi Fleksibel**: Proses verifikasi oleh admin dengan opsi persetujuan penuh, persetujuan parsial (dengan catatan), atau penolakan.
- **Dashboard Interaktif (Admin)**:
  - Visualisasi data kunci: Jumlah total barang, jumlah permintaan tertunda, barang dengan stok kritis.
  - Daftar notifikasi stok yang berada di bawah ambang batas.
  - Grafik sederhana tren permintaan barang bulanan.
- **Notifikasi Stok Kritis**: Sistem secara proaktif memberikan notifikasi visual di dashboard ketika stok barang mencapai ambang batas minimum.
- **Pencarian & Filter**: Fungsi pencarian dan filter pada halaman daftar barang untuk memudahkan navigasi.
- **Riwayat & Pelacakan**: Pengguna (Admin & Pegawai) dapat melacak riwayat dan status permintaan mereka.
- **Pencetakan Dokumen Resmi**: Generate lembar bukti permintaan barang ke format PDF yang rapi dan siap ditandatangani.
- **Laporan Periodik**: Admin dapat men-generate laporan penggunaan barang dalam rentang waktu tertentu (misal: mingguan, bulanan).

#### Di Luar Lingkup (Out-of-Scope) untuk Fase Ini

- Integrasi dengan sistem keuangan atau SIASN.
- Modul pengadaan barang (procurement) otomatis.
- Analisis prediktif untuk peramalan kebutuhan stok.
- Alur persetujuan berjenjang (multi-level approval).
- Manajemen aset non-persediaan (barang modal).

### 1.4. Identifikasi Stakeholder

| Peran            | Nama/Jabatan                  | Tanggung Jawab                                                                 |
| ---------------- | ----------------------------- | ------------------------------------------------------------------------------ |
| Pemilik Proyek   | Arya Setia Pratama            | Mendefinisikan kebutuhan, menyediakan data awal, melakukan UAT, pengguna utama |
| Pengembang       | Arya Setia Pratama            | Merancang arsitektur, mengembangkan, menguji, dan mendeploy sistem             |
| Pengguna Akhir   | Seluruh Pegawai BPS Pringsewu | Menggunakan sistem untuk mengajukan permintaan barang dan melacak statusnya    |
| Pendukung Teknis | Petugas IT/Infrastruktur BPS  | Menyiapkan server, memastikan jaringan, membantu deployment                    |

---

## 2. Tahap Analisis Kebutuhan (Requirement Analysis Phase)

### 2.1. Kebutuhan Fungsional (Functional Requirements)

- **Modul 1: Autentikasi & Manajemen Pengguna (Admin)**
  - Admin dapat mengelola data pengguna (tambah, ubah, nonaktifkan akun Pegawai).
  - Sistem membedakan sesi login antara Admin dan Pegawai.
- **Modul 2: Manajemen Barang & Stok (Admin)**
  - Admin dapat melakukan CRUD pada data master barang.
  - Admin dapat menginput penambahan stok untuk setiap barang melalui form khusus.
- **Modul 3: Dashboard & Monitoring (Admin)**
  - Menampilkan ringkasan statistik kunci (poin 1.3).
  - Menampilkan daftar barang yang stoknya di bawah ambang batas secara jelas.
- **Modul 4: Proses Permintaan (Pegawai)**
  - Pegawai dapat login dan mengakses form pengajuan permintaan.
  - Form menampilkan daftar barang (dengan fitur pencarian), satuan, dan sisa stok.
  - Pegawai dapat menambahkan beberapa barang dalam satu kali permintaan.
  - Pegawai dapat melihat riwayat dan status permintaan yang pernah diajukan.
- **Modul 5: Verifikasi Permintaan (Admin)**
  - Admin menerima notifikasi (visual di dashboard) untuk setiap permintaan baru.
  - Halaman verifikasi menampilkan detail permintaan, termasuk "Jumlah Diminta" dan "Stok Tersedia".
  - Admin mengisi kolom "Jumlah Disetujui" dan dapat memilih status (Setuju / Setuju Sebagian / Tolak).
  - Jika disetujui, stok barang otomatis berkurang sesuai "Jumlah Disetujui".
- **Modul 6: Pelaporan & Ekspor (Admin & Pegawai)**
  - Sistem dapat men-generate file PDF dari setiap detail permintaan.
  - Admin dapat men-generate laporan rekapitulasi penggunaan barang berdasarkan rentang tanggal.

### 2.2. Kebutuhan Non-Fungsional (Non-Functional Requirements)

| Kategori        | Kebutuhan                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------- |
| Usability       | Antarmuka harus bersih, modern, dan intuitif. Alur kerja jelas dan meminimalkan jumlah klik |
| Accessibility   | Aplikasi harus responsif, optimal di desktop & mobile                                       |
| Performance     | Waktu muat halaman ≤ 3 detik. Proses transaksi data harus instan                            |
| Security        | Login aman (hashing password Bcrypt), proteksi SQL Injection/XSS, otorisasi ketat           |
| Reliability     | Sistem tersedia 99% selama jam kerja. Backup database otomatis harian                       |
| Scalability     | Arsitektur memungkinkan penambahan fitur tanpa merombak sistem inti                         |
| Maintainability | Kode bersih, terstruktur, terdokumentasi                                                    |

### 2.3. Kebutuhan Pengguna (User Roles & Permissions)

| Fitur                              | Admin (Pengelola) | Pegawai (Pemohon) |
| ---------------------------------- | :---------------: | :---------------: |
| Login Sistem                       |        ✅         |        ✅         |
| Melihat Dashboard Interaktif       |        ✅         |        ❌         |
| Manajemen Barang (CRUD) & Stok     |        ✅         |        ❌         |
| Manajemen Pengguna                 |        ✅         |        ❌         |
| Mengajukan Permintaan Barang       |        ❌         |        ✅         |
| Verifikasi Permintaan              |        ✅         |        ❌         |
| Melihat Semua Riwayat Permintaan   |        ✅         |        ❌         |
| Melihat Riwayat Permintaan Pribadi |        ✅         |        ✅         |
| Cetak Bukti Permintaan             |        ✅         |        ✅         |
| Generate Laporan Periodik          |        ✅         |        ❌         |

---

### 2.4. Kebutuhan Data & Entitas (Detail)

**User**

- `id`: integer, primary key, auto increment
- `nama`: string, nama lengkap pengguna
- `username`: string, unik, digunakan untuk login
- `password`: string, hash bcrypt
- `role`: enum ['admin', 'pegawai'], default 'pegawai'
- `unit_kerja`: string, nama unit kerja/instansi
- `status_aktif`: boolean, default true (opsional, untuk nonaktifkan user)
- `created_at`: timestamp
- `updated_at`: timestamp

**Barang**

- `id`: integer, primary key, auto increment
- `kode_barang`: string, unik, kode inventaris barang
- `nama_barang`: string, nama barang
- `deskripsi`: text, keterangan barang (opsional)
- `satuan`: string, satuan barang (misal: pcs, box, liter)
- `stok`: integer, jumlah stok saat ini
- `ambang_batas_kritis`: integer, batas minimum stok sebelum notifikasi
- `status_aktif`: boolean, default true (opsional, untuk nonaktifkan barang)
- `created_at`: timestamp
- `updated_at`: timestamp

**Permintaan**

- `id`: integer, primary key, auto increment
- `id_user_pemohon`: integer, foreign key ke User
- `tanggal_permintaan`: date/datetime, waktu permintaan dibuat
- `status`: enum ['Menunggu', 'Disetujui', 'Disetujui Sebagian', 'Ditolak'], default 'Menunggu'
- `catatan_admin`: text, opsional, catatan verifikasi admin
- `id_user_verifikator`: integer, foreign key ke User (admin), opsional
- `tanggal_verifikasi`: date/datetime, opsional
- `created_at`: timestamp
- `updated_at`: timestamp

**Detail_Permintaan**

- `id`: integer, primary key, auto increment
- `id_permintaan`: integer, foreign key ke Permintaan
- `id_barang`: integer, foreign key ke Barang
- `jumlah_diminta`: integer, jumlah barang yang diminta
- `jumlah_disetujui`: integer, jumlah barang yang disetujui (default 0)
- `created_at`: timestamp
- `updated_at`: timestamp

---

## 3. Tahap Desain (Design Phase)

### 3.1. Desain Arsitektur Sistem

Menggunakan arsitektur **Model-View-Controller (MVC)** Laravel, dengan pendekatan API-first (backend dan frontend terpisah).

- **Presentation Layer (Frontend)**: React.js, Tailwind CSS, komunikasi via REST API.
- **Business Logic Layer (Backend)**: Laravel (PHP), autentikasi Sanctum, otorisasi, validasi, API provider.
- **Data Layer (Database)**: PostgreSQL, Eloquent ORM.

### 3.2. Desain Database (ERD)

- **Status**: Dalam Proses Desain.
- ERD memetakan hubungan antar entitas:
  - User ke Permintaan (One-to-Many): Satu pengguna bisa membuat banyak permintaan.
  - Permintaan ke Detail_Permintaan (One-to-Many): Satu permintaan bisa terdiri dari banyak item barang.
  - Barang ke Detail_Permintaan (One-to-Many): Satu jenis barang bisa muncul di banyak detail permintaan.

### 3.3. Desain Antarmuka (UI/UX Mockup)

- **Status**: Dalam Proses Desain.
- **Filosofi desain**: "Clarity and Efficiency" (bersih, whitespace, aksi utama menonjol).

#### Daftar Lengkap Halaman (Pages) SIAP

1. **Halaman Login**

   - Form login untuk Admin & Pegawai.

2. **Dashboard Admin**

   - Widget statistik, grafik tren permintaan, notifikasi stok kritis, daftar permintaan tertunda.

3. **Halaman Manajemen Barang (Admin)**

   - Tabel barang, modal form CRUD, pencarian & filter.

4. **Halaman Manajemen Pengguna (Admin)**

   - Tabel user, modal form tambah/edit/nonaktifkan user.

5. **Halaman Daftar Barang (Pegawai)**

   - Tabel barang, search bar, filter, info stok.

6. **Form Pengajuan Permintaan (Pegawai)**

   - Multi-item, pilih barang, jumlah, satuan, info stok.

7. **Halaman Riwayat Permintaan (Pegawai)**

   - Daftar permintaan yang pernah diajukan, status permintaan.

8. **Halaman Verifikasi Permintaan (Admin)**

   - Daftar permintaan masuk, detail permintaan, form verifikasi (setuju/sebagian/tolak, jumlah disetujui, catatan).

9. **Halaman Detail Permintaan**

   - Detail permintaan (barang, jumlah, status, catatan), bisa diakses oleh admin/pegawai.

10. **Halaman Laporan Periodik (Admin)**

    - Filter tanggal, rekap penggunaan barang, ekspor PDF.

11. **Halaman Notifikasi/Stok Kritis (Admin)**

    - Daftar barang di bawah ambang batas, aksi penambahan stok.

12. **Halaman Cetak Bukti Permintaan**

    - Preview dan tombol cetak PDF permintaan.

13. **Halaman Profil Pengguna**

    - Edit data diri, ubah password (opsional).

14. **Halaman Error/Forbidden/404**
    - Untuk handling akses tidak sah atau halaman tidak ditemukan.

---

## 4. Tahap Pengembangan (Development Phase) - Rencana Sprint 5 Hari

**Status**: Siap Dimulai (24 Juli - 28 Juli 2025)

---

### **Hari ke-1: Fondasi & Core Backend**

- **Setup Proyek Laravel**
  - Inisialisasi project baru dengan `laravel new siap` atau `composer create-project`.
  - Konfigurasi environment `.env` (database, mail, dsb).
  - Inisialisasi git repository.
- **Konfigurasi Database**
  - Pilih PostgreSQL, buat database baru.
  - Update koneksi di `.env`.
- **Instalasi Dependensi**
  - Install package utama: Laravel Sanctum (autentikasi), Eloquent, dan package pendukung (barryvdh/laravel-dompdf, dsb).
- **Implementasi Autentikasi**
  - Setup login/logout untuk Admin & Pegawai (menggunakan role).
  - Buat migrasi dan seeder untuk tabel `users` dengan field: nama, username, password (bcrypt), role, unit_kerja.
  - Implementasi middleware otorisasi (role-based).
- **Desain Skema Database & Migrasi**
  - Buat migrasi untuk tabel: `users`, `barang`, `permintaan`, `detail_permintaan`.
  - Definisikan relasi foreign key.
- **Model, Controller, Route untuk CRUD Barang**
  - Buat model `Barang`, controller `BarangController` (API Resource).
  - Implementasi endpoint CRUD: `GET`, `POST`, `PUT`, `DELETE`.
  - Proteksi endpoint dengan middleware (hanya Admin).

---

### **Hari ke-2: Fungsionalitas Admin & UI Dasar**

- **Implementasi CRUD Barang Backend**
  - Selesaikan validasi input, error handling, dan response API.
  - Tambahkan fitur pencarian dan filter barang.
- **Fitur Penambahan Stok**
  - Endpoint khusus untuk menambah stok barang.
  - Validasi input dan update field `stok` pada tabel `barang`.
  - Catat log penambahan stok (opsional).
- **UI Dasar Manajemen Barang & Daftar Barang**
  - Buat halaman frontend (React) untuk daftar barang (tabel, search bar, filter).
  - Form modal untuk tambah/edit barang.
- **Mulai UI Dashboard Admin (Statis)**
  - Buat komponen dashboard: widget jumlah barang, permintaan tertunda, barang kritis.
  - Grafik dummy tren permintaan bulanan.

---

### **Hari ke-3: Alur Kerja Permintaan (Pegawai)**

- **Backend Proses Pengajuan Permintaan**
  - Endpoint untuk membuat permintaan baru (tabel `permintaan` dan `detail_permintaan`).
  - Validasi stok tersedia sebelum permintaan.
- **UI Form Pengajuan Permintaan Dinamis**
  - Form multi-item: pilih barang, jumlah, satuan, tampilkan sisa stok.
  - Data barang diambil dari API.
- **Halaman Riwayat Permintaan Pegawai**
  - Tampilkan daftar permintaan yang pernah diajukan.
  - Status permintaan: Menunggu, Disetujui, Sebagian, Ditolak.

---

### **Hari ke-4: Alur Kerja Verifikasi & Logika Inti (Admin)**

- **Backend Proses Verifikasi**
  - Endpoint untuk verifikasi permintaan: setuju, setuju sebagian (dengan catatan), tolak.
  - Update status permintaan dan detail permintaan.
- **Logika Pengurangan Stok Otomatis**
  - Setelah permintaan disetujui, kurangi stok barang sesuai jumlah disetujui.
  - Validasi agar stok tidak minus.
- **UI Halaman Verifikasi Permintaan Admin**
  - Tampilkan detail permintaan, jumlah diminta, stok tersedia.
  - Form input jumlah disetujui dan status.
- **Data Dinamis ke Dashboard Admin**
  - Update widget dashboard dengan data real-time (jumlah permintaan, barang kritis, dsb).

---

### **Hari ke-5: Fitur Pelengkap, Polish, & Staging**

- **Fitur "Cetak ke PDF" Lembar Permintaan**
  - Implementasi backend (barryvdh/laravel-dompdf) untuk generate PDF permintaan.
  - Tombol cetak di frontend.
- **Fitur Laporan Periodik Sederhana**
  - Endpoint dan UI untuk generate laporan penggunaan barang (filter tanggal).
  - Ekspor ke PDF.
- **Refactoring, Finalisasi UI, Pengujian Internal**
  - Review dan perbaiki kode, konsistensi UI, uji fungsionalitas utama.
- **Deployment ke Server Staging (UAT)**
  - Push ke server, jalankan migrasi, install dependensi.
  - Uji coba bersama user (UAT).

---

---

## 5. Tahap Pengujian (Testing Phase)

**Status**: Direncanakan (Paralel dengan Pengembangan & Pasca-Sprint)

- **Unit Testing**: Fungsi krusial (kalkulasi stok, logika verifikasi) diuji terisolasi (PHPUnit).
- **Integration Testing**: Frontend-backend API, alur kerja end-to-end.
- **User Acceptance Test (UAT)**: Oleh Pengelola Barang pada akhir sprint. Skenario:
  - Admin menambah barang baru.
  - Pegawai mengajukan permintaan 3 item barang.
  - Admin menyetujui sebagian permintaan.
  - Verifikasi stok berkurang dengan benar.
  - Cetak bukti permintaan dari sistem.

---

## 6. Tahap Implementasi (Deployment Phase)

**Status**: Direncanakan setelah UAT disetujui

- **Persiapan Server Produksi**: Konfigurasi server sesuai kebutuhan aplikasi.
- **Deployment Checklist**: git pull, composer install, npm install, migration, dll.
- **Migrasi Data Awal**: Import data master barang & pengguna awal ke database produksi.
- **Sesi Pelatihan**: Pelatihan singkat untuk Admin & sosialisasi ke pegawai.
- **Go-Live**: Aplikasi resmi diluncurkan dan digunakan untuk operasional.

---

## 7. Tahap Pemeliharaan (Maintenance Phase)

**Status**: Direncanakan Pasca-Peluncuran

- **Dukungan Teknis**: Perbaikan bug kritikal (SLA respons < 24 jam) selama 1 bulan pertama.
- **Backup & Keamanan**: Pemantauan rutin dan backup data harian.
- **Iterasi Berikutnya**: Pengembangan fitur dari daftar Out-of-Scope berdasarkan feedback pengguna setelah 3 bulan.

---

## 8. Analisis & Mitigasi Risiko

| Kategori    | Risiko                                 | Strategi Mitigasi                                                                                  |
| ----------- | -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Jadwal      | Kualitas Kode & Pengujian Terburu-buru | Prioritas Brutal: Fokus 100% pada fitur MVP, permintaan tambahan dicatat untuk fase berikutnya     |
| Teknis      | Scope Creep (Perubahan Lingkup)        | Manajemen Ekspektasi: Sprint 5 hari fokus MVP, ide baru masuk backlog iterasi selanjutnya          |
| Sumber Daya | Ketergantungan Developer Tunggal       | Dokumentasi Proaktif: PHPDoc, commit message deskriptif, kode bersih standar Laravel               |
| Klien       | Resistensi Adopsi Pengguna             | Advokasi & Pelatihan: Pengelola Barang sebagai champion, pelatihan fokus pada manfaat bagi pegawai |

---

## Timeline Pengembangan Proyek SIAP (Solo Fullstack Developer)

| Hari/Tanggal     | Fokus Utama            | Backend (BE)                                                                                                                                     | Frontend (FE)                                                                | Catatan Penting                                |
| ---------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ---------------------------------------------- |
| Hari 1 (24 Juli) | Fondasi & Setup        | - Inisialisasi proyek Laravel<br>- Setup database & environment<br>- Migrasi tabel utama<br>- Seeder user & barang<br>- Setup autentikasi & role | - Setup project React<br>- Struktur folder & routing dasar               | Pastikan API login & CRUD barang siap          |
| Hari 2 (25 Juli) | CRUD & Stok            | - CRUD Barang (API)<br>- Endpoint penambahan stok<br>- Validasi input                                                                            | - Halaman daftar barang (tabel, search, filter)<br>- Form tambah/edit barang | Dummy data FE, integrasi API barang            |
| Hari 3 (26 Juli) | Permintaan Barang      | - Endpoint permintaan barang (multi-item)<br>- Validasi stok<br>- Riwayat permintaan                                                             | - Form pengajuan permintaan<br>- Halaman riwayat permintaan pegawai          | FE gunakan dummy, integrasi setelah API stabil |
| Hari 4 (27 Juli) | Verifikasi & Dashboard | - Endpoint verifikasi permintaan<br>- Logika pengurangan stok<br>- Statistik dashboard                                                           | - Halaman verifikasi permintaan admin<br>- Dashboard admin (widget, grafik)  | Integrasi FE dengan API dashboard              |
| Hari 5 (28 Juli) | Pelengkap & Uji Coba   | - Endpoint & logic cetak PDF<br>- Endpoint laporan periodik<br>- Refactor & unit test                                                            | - Tombol cetak PDF<br>- Halaman laporan penggunaan barang<br>- Finalisasi UI | Uji end-to-end, push ke staging/UAT            |

**Tips:**

- Kerjakan backend dulu hingga API stabil, lalu frontend bisa mulai dengan dummy data dan integrasi bertahap.
- Setiap selesai endpoint utama, segera tes dengan Postman sebelum integrasi ke frontend.
- Prioritaskan fitur MVP, fitur tambahan bisa masuk backlog.

---
