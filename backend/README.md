# 🚀 SIAP BPS Pringsewu - Backend

**Sistem Aplikasi Pengelolaan Aset & Persediaan (SIAP)** adalah backend berbasis NestJS yang menyediakan API modern untuk manajemen barang persediaan di BPS Kabupaten Pringsewu. Dirancang dengan arsitektur bersih, performa tinggi, dan keamanan optimal.

---

## ✨ Fitur Unggulan

- **🔐 Autentikasi & Otorisasi**
  - Login/logout dengan JWT
  - Role-based access (admin/pegawai)
  - Blacklist token untuk keamanan ekstra

- **👥 Manajemen Pengguna**
  - CRUD user & profil
  - Upload foto profil
  - Soft delete user

- **📦 Pengelolaan Barang**
  - CRUD barang & kategori
  - Penambahan stok & deteksi barang kritis
  - Laporan penggunaan dalam PDF

- **🛒 Permintaan Barang**
  - Pengajuan multi-item
  - Verifikasi permintaan
  - Tracking status & riwayat

- **📊 Dashboard & Statistik**
  - Statistik barang & tren permintaan
  - Notifikasi stok kritis

- **📃 PDF Generator**
  - Bukti permintaan & laporan periodik

- **🧪 Unit & E2E Testing**
  - Coverage tinggi untuk service, controller, dan guard

---

## 🛠️ Teknologi

| Kategori          | Teknologi         |
| ----------------- | ----------------- |
| **Framework**     | NestJS            |
| **Database**      | PostgreSQL        |
| **ORM**           | TypeORM           |
| **Autentikasi**   | JWT (@nestjs/jwt) |
| **Validasi**      | class-validator   |
| **File Upload**   | Multer            |
| **PDF Generator** | PDFMake           |
| **Testing**       | Jest, SuperTest   |

---

## 📁 Struktur Folder

```
src/
├── assets/            # Gambar & font PDF
├── auth/              # Modul autentikasi & role
├── barang/            # Modul barang & kategori
├── docs/              # Dokumentasi API
├── entities/          # Entitas TypeORM
├── migrations/        # Migrasi database
├── permintaan/        # Modul permintaan & verifikasi
├── user/              # Modul pengguna
├── uploads/           # File upload
├── app.module.ts      # Modul utama
├── main.ts            # Entry point
└── seeder.ts          # Seeder data awal
```

---

## 🚦 Instalasi & Menjalankan

1. **Clone repository & install dependencies**

   ```bash
   git clone <repo-url>
   cd backend
   npm install
   ```

2. **Konfigurasi environment**
   - Copy `.env.example` ke `.env` dan sesuaikan:
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_USERNAME=postgres
     DB_PASSWORD=your_password
     DB_DATABASE=siap_bps_pringsewu
     JWT_SECRET=your_secret_key
     ```

3. **Setup database**

   ```bash
   npm run migration:run
   npm run seed
   ```

4. **Jalankan server**

   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

5. **Testing**
   ```bash
   npm run test        # Unit tests
   npm run test:e2e    # E2E tests
   npm run test:cov    # Coverage
   ```

---

## 🔑 API Endpoints (Ringkasan)

### Autentikasi

- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Pengguna

- `POST /api/user` - Buat user baru (admin)
- `GET /api/user` - List user (admin)
- `GET /api/user/:id` - Detail user (admin)
- `PATCH /api/user/:id` - Update user (admin)
- `DELETE /api/user/:id` - Soft delete (admin)
- `GET /api/user/profile` - Profil user login
- `PATCH /api/user/profile` - Update profil
- `PATCH /api/user/profile/foto` - Upload foto

### Barang

- `POST /api/barang` - Buat barang (admin)
- `GET /api/barang` - List barang
- `GET /api/barang/:id` - Detail barang
- `PATCH /api/barang/:id` - Update barang (admin)
- `DELETE /api/barang/:id` - Soft delete (admin)
- `PATCH /api/barang/:id/add-stok` - Tambah stok (admin)
- `GET /api/barang/stok-kritis` - Barang kritis
- `GET /api/barang/laporan-penggunaan/pdf` - Laporan PDF

### Permintaan

- `POST /api/permintaan` - Ajukan permintaan (pegawai)
- `GET /api/permintaan/riwayat` - Riwayat permintaan (pegawai)
- `GET /api/permintaan/masuk` - Permintaan masuk (admin)
- `GET /api/permintaan/:id` - Detail permintaan
- `PATCH /api/permintaan/:id/verifikasi` - Verifikasi (admin)
- `GET /api/permintaan/:id/pdf` - Bukti PDF
- `GET /api/permintaan/dashboard/statistik` - Statistik dashboard (admin)
- `GET /api/permintaan/dashboard/tren-permintaan` - Tren permintaan (admin)

---

## 📚 Dokumentasi API

Dokumentasi lengkap tersedia di file berikut:

- [Autentikasi API](./src/docs/AUTH_API.md)
- [User API](./src/docs/USER_API.md)
- [Barang API](./src/docs/BARANG_API.md)
- [Permintaan API](./src/docs/PERMINTAAN_API.md)

---

## 🔒 Mekanisme Otorisasi

- **JWT Authentication Guard**: Verifikasi token setiap request
- **Roles Decorator & Guard**:
  ```typescript
  @Roles('admin')
  @Get('users')
  findAll() { ... }
  ```
- **Blacklist Token**: Token logout tidak dapat digunakan lagi

---

## 🧪 Testing & Code Quality

- Unit Test (Jest)
- E2E Test (SuperTest)
- Validasi data (class-validator)
- ESLint & Prettier
- Konsistensi error handling

---

## 🌟 Best Practices

- Dependency Injection
- Repository pattern (TypeORM)
- Service-oriented architecture
- Validation pipes & DTO
- Error handling terpusat
- File upload validasi tipe & ukuran
- PDF generation dengan templating

---

## 👨‍💻 Developer

**Arya Setia Pratama**  
[GitHub: aryasetiap](https://github.com/aryasetiap)  
WhatsApp: 085669644533

---

> **Dokumentasi komprehensif tersedia di ENDPOINT_API.md**  
> Silakan buka issue atau pull request untuk kontribusi 🚀
