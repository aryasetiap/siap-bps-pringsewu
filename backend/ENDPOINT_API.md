# Dokumentasi API SIAP BPS Pringsewu

Dokumentasi ini mencakup seluruh endpoint utama pada backend SIAP BPS Pringsewu, meliputi autentikasi, manajemen user, barang, permintaan barang, serta mekanisme proteksi dan error handling.

---

## 1. API Autentikasi (Auth API)

Modul autentikasi menyediakan endpoint untuk login, logout, serta mekanisme proteksi endpoint menggunakan JWT dan role-based access control.

### Endpoint

#### 1. Login

- **URL:** `/auth/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response:**
  - **200 OK**
    ```json
    {
      "access_token": "jwt_token_string",
      "user": {
        "id": 1,
        "username": "admin",
        "role": "admin",
        "nama": "Admin SIAP"
      }
    }
    ```
  - **401 Unauthorized**
    - Jika username tidak ditemukan:
      ```json
      {
        "statusCode": 401,
        "message": "User not found",
        "error": "Unauthorized"
      }
      ```
    - Jika password salah:
      ```json
      {
        "statusCode": 401,
        "message": "Invalid password",
        "error": "Unauthorized"
      }
      ```

- **Deskripsi:**  
  Melakukan autentikasi user. Jika berhasil, mengembalikan JWT token dan data user.

#### 2. Logout

- **URL:** `/auth/logout`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Response:**
  - **200 OK**
    ```json
    { "message": "Logout success (token revoked)" }
    ```
  - **200 OK** (jika tidak ada token)
    ```json
    { "message": "No token provided" }
    ```

- **Deskripsi:**  
  Melakukan logout user dengan menambahkan token ke blacklist (token tidak dapat digunakan lagi).

### Mekanisme Autentikasi

- **JWT (JSON Web Token):**
  - Token JWT di-generate saat login dan dikirimkan pada header `Authorization: Bearer <token>` untuk setiap request ke endpoint yang dilindungi.
  - Token memiliki masa berlaku (`expiresIn: 1d`).
  - Token yang sudah di-logout akan masuk blacklist dan tidak dapat digunakan lagi.

- **Proteksi Endpoint:**
  - Gunakan guard [`JwtAuthGuard`](src/auth/jwt-auth.guard.ts) untuk melindungi endpoint (hanya user dengan token valid yang bisa mengakses).
  - Gunakan decorator [`@Roles(...roles)`](src/auth/roles.decorator.ts) dan guard [`RolesGuard`](src/auth/roles.guard.ts) untuk membatasi akses berdasarkan role (`admin` atau `pegawai`).

### Contoh Penggunaan

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

#### Logout

```http
POST /auth/logout
Authorization: Bearer <jwt_token>
```

### Middleware & Guard

- **JwtAuthGuard**  
  Melindungi endpoint dari akses tanpa token JWT yang valid.  
  Implementasi: [src/auth/jwt-auth.guard.ts](src/auth/jwt-auth.guard.ts)

- **RolesGuard**  
  Membatasi akses endpoint berdasarkan role user.  
  Implementasi: [src/auth/roles.guard.ts](src/auth/roles.guard.ts)

- **@Roles Decorator**  
  Menandai endpoint hanya bisa diakses oleh role tertentu.  
  Implementasi: [src/auth/roles.decorator.ts](src/auth/roles.decorator.ts)

### Struktur Payload JWT

```json
{
  "sub": 1,
  "username": "admin",
  "role": "admin",
  "iat": 1690000000,
  "exp": 1690086400
}
```

### Error Handling

- **401 Unauthorized**: Token tidak valid, expired, atau sudah di-blacklist. Username/password salah saat login.
- **200 OK**: Logout tanpa token tetap mengembalikan pesan `"No token provided"`.

### Unit Test

- [src/auth/auth.service.spec.ts](src/auth/auth.service.spec.ts)
- [src/auth/auth.controller.spec.ts](src/auth/auth.controller.spec.ts)
- [src/auth/roles.guard.spec.ts](src/auth/roles.guard.spec.ts)

### Dependensi

- JWT: [`@nestjs/jwt`](https://docs.nestjs.com/security/authentication#jwt-functionality)
- Hashing password: [`bcryptjs`](https://www.npmjs.com/package/bcryptjs)
- Role-based access: Custom decorator dan guard

### Referensi Kode

- Service: [`AuthService`](src/auth/auth.service.ts)
- Controller: [`AuthController`](src/auth/auth.controller.ts)
- JWT Guard: [`JwtAuthGuard`](src/auth/jwt-auth.guard.ts)
- JWT Strategy: [`JwtStrategy`](src/auth/jwt.strategy.ts)
- Roles Guard: [`RolesGuard`](src/auth/roles.guard.ts)

---

## 2. API User (User API)

Modul User menyediakan endpoint untuk manajemen data pengguna (admin & pegawai), termasuk CRUD, update profil, upload foto profil, serta proteksi endpoint berbasis role.

### Endpoint

#### 1. Membuat User Baru (Admin)

- **URL:** `/user`
- **Method:** `POST`
- **Role:** admin
- **Body:**
  ```json
  {
    "nama": "Budi Santoso",
    "username": "budi",
    "password": "budi123",
    "role": "pegawai",
    "unit_kerja": "Statistik Produksi",
    "foto": "https://example.com/foto.jpg"
  }
  ```
- **Response:**
  - **201 Created**: Data user yang berhasil dibuat
  - **400 Bad Request**: Username sudah terdaftar

#### 2. Mengambil Daftar Seluruh User (Admin)

- **URL:** `/user`
- **Method:** `GET`
- **Role:** admin
- **Response:**
  - **200 OK**: Array data user

#### 3. Mengambil Data User Berdasarkan ID (Admin)

- **URL:** `/user/:id`
- **Method:** `GET`
- **Role:** admin
- **Response:**
  - **200 OK**: Data user
  - **404 Not Found**: Jika user tidak ditemukan

#### 4. Memperbarui Data User Berdasarkan ID (Admin)

- **URL:** `/user/:id`
- **Method:** `PATCH`
- **Role:** admin
- **Body:**  
  Field yang ingin diperbarui (parsial, lihat [UpdateUserDto](src/user/dto/update-user.dto.ts))
- **Response:**
  - **200 OK**: Data user yang telah diperbarui
  - **404 Not Found**: Jika user tidak ditemukan

#### 5. Soft Delete User Berdasarkan ID (Admin)

- **URL:** `/user/:id`
- **Method:** `DELETE`
- **Role:** admin
- **Response:**
  - **200 OK**: User dengan `status_aktif: false`
  - **404 Not Found**: Jika user tidak ditemukan

#### 6. Menghapus User Berdasarkan Username (Admin, untuk testing/dev)

- **URL:** `/user`
- **Method:** `DELETE`
- **Role:** admin
- **Body:**
  ```json
  { "username": "budi" }
  ```
- **Response:**
  - **200 OK**: User di-nonaktifkan atau pesan "User tidak ditemukan"

#### 7. Mengambil Profil User yang Sedang Login

- **URL:** `/user/profile`
- **Method:** `GET`
- **Auth:** JWT
- **Response:**
  - **200 OK**: Data user yang sedang login

#### 8. Memperbarui Profil User yang Sedang Login

- **URL:** `/user/profile`
- **Method:** `PATCH`
- **Auth:** JWT
- **Body:**  
  Field yang ingin diperbarui (parsial, lihat [UpdateUserDto](src/user/dto/update-user.dto.ts))
- **Response:**
  - **200 OK**: Data user yang telah diperbarui

#### 9. Upload/Update Foto Profil User yang Sedang Login

- **URL:** `/user/profile/foto`
- **Method:** `PATCH`
- **Auth:** JWT
- **Form Data:**
  - `foto`: file (image/jpeg, image/png, image/webp, max 2MB)
- **Response:**
  - **200 OK**: Data user dengan path foto terbaru
  - **400 Bad Request**: Jika file bukan gambar atau melebihi batas ukuran

#### 10. Endpoint Khusus Role

- **URL:** `/user/admin-only`
- **Method:** `GET`
- **Role:** admin
- **Response:**

  ```json
  { "message": "Data khusus admin" }
  ```

- **URL:** `/user/pegawai-only`
- **Method:** `GET`
- **Role:** pegawai
- **Response:**
  ```json
  { "message": "Data khusus pegawai" }
  ```

### DTO & Validasi

- [`CreateUserDto`](src/user/dto/create-user.dto.ts): Validasi pembuatan user baru (nama, username, password wajib, role opsional)
- [`UpdateUserDto`](src/user/dto/update-user.dto.ts): Validasi update user (semua field opsional, password otomatis di-hash jika diisi)

### Error Handling

- **400 Bad Request**: Username sudah terdaftar, file upload tidak valid
- **404 Not Found**: User tidak ditemukan
- **401 Unauthorized**: Tidak ada/invalid token
- **403 Forbidden**: Role tidak sesuai

### Proteksi Endpoint

- Semua endpoint diproteksi JWT (`AuthGuard('jwt')`)
- Endpoint CRUD hanya untuk role `admin` ([`RolesGuard`](src/auth/roles.guard.ts))
- Endpoint profil dapat diakses user login (admin/pegawai)

### Contoh Penggunaan

#### Membuat User Baru

```http
POST /user
Authorization: Bearer <token-admin>
Content-Type: application/json

{
  "nama": "Budi Santoso",
  "username": "budi",
  "password": "budi123",
  "role": "pegawai",
  "unit_kerja": "Statistik Produksi"
}
```

#### Update Profil User

```http
PATCH /user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "nama": "Budi S.",
  "password": "passwordBaru"
}
```

#### Upload Foto Profil

```http
PATCH /user/profile/foto
Authorization: Bearer <token>
Content-Type: multipart/form-data

foto: <file>
```

### Unit Test

- [src/user/user.service.spec.ts](src/user/user.service.spec.ts)
- [src/user/user.controller.spec.ts](src/user/user.controller.spec.ts)

### Referensi Kode

- Service: [`UserService`](src/user/user.service.ts)
- Controller: [`UserController`](src/user/user.controller.ts)
- DTO: [`CreateUserDto`](src/user/dto/create-user.dto.ts), [`UpdateUserDto`](src/user/dto/update-user.dto.ts)
- Modul: [`UserModule`](src/user/user.module.ts)

---

## 3. API Barang (Barang API)

Modul Barang menyediakan endpoint untuk manajemen data barang persediaan, termasuk CRUD, penambahan stok, filter stok kritis, notifikasi, dan laporan penggunaan barang dalam format PDF.

### Endpoint

#### 1. Membuat Barang Baru

- **URL:** `/barang`
- **Method:** `POST`
- **Role:** admin
- **Body:**
  ```json
  {
    "kode_barang": "BRG001",
    "nama_barang": "Kertas A4",
    "deskripsi": "Kertas HVS ukuran A4, 80gsm",
    "satuan": "rim",
    "stok": 100,
    "ambang_batas_kritis": 10,
    "foto": "https://example.com/kertas.jpg"
  }
  ```
- **Response:**
  - **201 Created**: Data barang yang berhasil dibuat
  - **400 Bad Request**: Jika kode_barang sudah terdaftar atau data tidak valid

#### 2. Mendapatkan Daftar Barang

- **URL:** `/barang`
- **Method:** `GET`
- **Role:** admin
- **Query Params (opsional):**
  - `q`: Pencarian nama/kode barang (string)
  - `status_aktif`: Filter status aktif (`true`/`false`)
  - `stok_kritis`: Filter barang stok kritis (`true`)
- **Response:**
  - **200 OK**: Array data barang

#### 3. Mendapatkan Detail Barang

- **URL:** `/barang/:id`
- **Method:** `GET`
- **Role:** admin
- **Response:**
  - **200 OK**: Detail barang
  - **404 Not Found**: Jika barang tidak ditemukan

#### 4. Memperbarui Data Barang

- **URL:** `/barang/:id`
- **Method:** `PATCH`
- **Role:** admin
- **Body:**  
  Field yang ingin diperbarui (parsial, lihat [UpdateBarangDto](src/barang/dto/update-barang.dto.ts))
- **Response:**
  - **200 OK**: Data barang yang telah diperbarui
  - **400 Bad Request**: Jika stok negatif
  - **404 Not Found**: Jika barang tidak ditemukan

#### 5. Soft Delete Barang

- **URL:** `/barang/:id`
- **Method:** `DELETE`
- **Role:** admin
- **Response:**
  - **200 OK**: Barang dengan `status_aktif: false`
  - **404 Not Found**: Jika barang tidak ditemukan

#### 6. Menambah Stok Barang

- **URL:** `/barang/:id/add-stok`
- **Method:** `PATCH`
- **Role:** admin
- **Body:**
  ```json
  { "jumlah": 10 }
  ```
- **Response:**
  - **200 OK**: Barang dengan stok terbaru
  - **400 Bad Request**: Jika barang tidak aktif atau jumlah < 1
  - **404 Not Found**: Jika barang tidak ditemukan

#### 7. Mendapatkan Daftar Barang Stok Kritis

- **URL:** `/barang/stok-kritis`
- **Method:** `GET`
- **Role:** admin
- **Response:**
  - **200 OK**: Daftar barang dengan stok <= ambang_batas_kritis dan status_aktif

#### 8. Notifikasi Stok Kritis (Dashboard)

- **URL:** `/barang/dashboard/notifikasi-stok-kritis`
- **Method:** `GET`
- **Role:** user login (admin/pegawai)
- **Response:**
  - **200 OK**: Daftar barang kritis, terurut stok naik

#### 9. Laporan Penggunaan Barang (PDF)

- **URL:** `/barang/laporan-penggunaan/pdf`
- **Method:** `GET`
- **Role:** user login (admin/pegawai)
- **Query Params:**
  - `start`: Tanggal awal (YYYY-MM-DD)
  - `end`: Tanggal akhir (YYYY-MM-DD)
- **Response:**
  - **200 OK**: File PDF (Content-Type: application/pdf)
  - **400 Bad Request**: Format tanggal salah atau start > end

### DTO & Validasi

- [`CreateBarangDto`](src/barang/dto/create-barang.dto.ts): Validasi pembuatan barang baru
- [`UpdateBarangDto`](src/barang/dto/update-barang.dto.ts): Validasi update barang (parsial)
- [`AddStokDto`](src/barang/dto/add-stok.dto.ts): Validasi penambahan stok (jumlah minimal 1)

### Error Handling

- **400 Bad Request**: Data tidak valid, stok/jumlah negatif, kode_barang duplikat, barang tidak aktif
- **404 Not Found**: Barang tidak ditemukan
- **401 Unauthorized**: Tidak ada/invalid token
- **403 Forbidden**: Role tidak sesuai

### Proteksi Endpoint

- Semua endpoint diproteksi JWT (`AuthGuard('jwt')`)
- Endpoint CRUD hanya untuk role `admin` ([`RolesGuard`](src/auth/roles.guard.ts))
- Endpoint notifikasi/laporan PDF bisa diakses user login (admin/pegawai)

### Contoh Penggunaan

#### Membuat Barang

```http
POST /barang
Authorization: Bearer <token-admin>
Content-Type: application/json

{
  "kode_barang": "BRG002",
  "nama_barang": "Spidol Whiteboard",
  "satuan": "pcs",
  "stok": 20,
  "ambang_batas_kritis": 5
}
```

#### Menambah Stok

```http
PATCH /barang/1/add-stok
Authorization: Bearer <token-admin>
Content-Type: application/json

{ "jumlah": 10 }
```

#### Mendapatkan Laporan Penggunaan Barang (PDF)

```http
GET /barang/laporan-penggunaan/pdf?start=2024-07-01&end=2024-07-31
Authorization: Bearer <token>
```

### Unit Test

- [src/barang/barang.service.spec.ts](src/barang/barang.service.spec.ts)
- [src/barang/barang.controller.spec.ts](src/barang/barang.controller.spec.ts)

### Referensi Kode

- Service: [`BarangService`](src/barang/barang.service.ts)
- Controller: [`BarangController`](src/barang/barang.controller.ts)
- DTO: [`CreateBarangDto`](src/barang/dto/create-barang.dto.ts), [`UpdateBarangDto`](src/barang/dto/update-barang.dto.ts), [`AddStokDto`](src/barang/dto/add-stok.dto.ts)
- Modul: [`BarangModule`](src/barang/barang.module.ts)

---

## 4. API Permintaan Barang (Permintaan API)

Modul Permintaan menyediakan endpoint untuk pengajuan permintaan barang oleh pegawai, riwayat permintaan, verifikasi permintaan oleh admin, statistik dashboard, tren permintaan bulanan, dan cetak bukti permintaan ke PDF.

### Endpoint

#### 1. Membuat Permintaan Barang

- **URL:** `/permintaan`
- **Method:** `POST`
- **Role:** pegawai
- **Auth:** JWT
- **Body:**
  ```json
  {
    "items": [
      { "id_barang": 1, "jumlah": 2 },
      { "id_barang": 2, "jumlah": 1 }
    ],
    "catatan": "Untuk keperluan rapat bulanan"
  }
  ```
- **Response:**
  - **201 Created**
    ```json
    {
      "id": 10,
      "id_user_pemohon": 3,
      "catatan": "Untuk keperluan rapat bulanan",
      "status": "Menunggu",
      "tanggal_permintaan": "2024-07-24T10:00:00.000Z",
      "items": [
        {
          "id": 100,
          "id_barang": 1,
          "jumlah_diminta": 2,
          "jumlah_disetujui": 0
        }
      ]
    }
    ```
  - **400 Bad Request**: Jika stok tidak cukup, barang tidak ditemukan, atau items kosong.

#### 2. Melihat Riwayat Permintaan (Pegawai)

- **URL:** `/permintaan/riwayat`
- **Method:** `GET`
- **Role:** pegawai
- **Auth:** JWT
- **Response:**
  - **200 OK**: Array riwayat permintaan user

#### 3. Daftar Permintaan Masuk (Admin)

- **URL:** `/permintaan/masuk`
- **Method:** `GET`
- **Role:** admin
- **Auth:** JWT
- **Response:**
  - **200 OK**: Daftar permintaan status "Menunggu" beserta detail barang dan pemohon.

#### 4. Detail Permintaan (Pegawai/Admin)

- **URL:** `/permintaan/:id`
- **Method:** `GET`
- **Role:** pegawai (hanya milik sendiri) / admin (semua)
- **Auth:** JWT
- **Response:**
  - **200 OK**: Data permintaan beserta detail barang, status, catatan, pemohon.
  - **403 Forbidden**: Jika pegawai mengakses permintaan milik user lain.
  - **404 Not Found**: Jika permintaan tidak ditemukan.

#### 5. Verifikasi Permintaan (Admin)

- **URL:** `/permintaan/:id/verifikasi`
- **Method:** `PATCH`
- **Role:** admin
- **Auth:** JWT
- **Body:**

  ```json
  {
    "keputusan": "setuju",
    "items": [
      { "id_detail": 100, "jumlah_disetujui": 2 },
      { "id_detail": 101, "jumlah_disetujui": 1 }
    ],
    "catatan_verifikasi": "Disetujui untuk kebutuhan rapat"
  }
  ```

  - `keputusan`: "setuju" | "sebagian" | "tolak"
  - `items`: Daftar detail permintaan yang diverifikasi, wajib minimal 1 item.
  - `catatan_verifikasi`: Opsional.

- **Response:**
  - **200 OK**: Data permintaan yang telah diverifikasi (status, items, catatan).
  - **400 Bad Request**: Jika stok tidak cukup, jumlah_disetujui > jumlah_diminta, atau permintaan sudah diverifikasi.
  - **404 Not Found**: Jika permintaan tidak ditemukan.

#### 6. Statistik Dashboard Permintaan (Admin)

- **URL:** `/permintaan/dashboard/statistik`
- **Method:** `GET`
- **Role:** admin
- **Auth:** JWT
- **Response:**
  - **200 OK**
    ```json
    {
      "totalBarang": 20,
      "totalPermintaanTertunda": 3,
      "totalBarangKritis": 2,
      "totalUser": 15
    }
    ```
  - **Deskripsi:**  
    Mengembalikan statistik total barang, permintaan tertunda, barang kritis, **dan total user aktif** untuk dashboard admin.

#### 7. Tren Permintaan Bulanan (Admin)

- **URL:** `/permintaan/dashboard/tren-permintaan`
- **Method:** `GET`
- **Role:** admin
- **Auth:** JWT
- **Response:**
  - **200 OK**
    ```json
    [
      { "bulan": "2024-07", "jumlah": 5 },
      { "bulan": "2024-08", "jumlah": 2 }
    ]
    ```

#### 8. Cetak Bukti Permintaan ke PDF

- **URL:** `/permintaan/:id/pdf`
- **Method:** `GET`
- **Role:** pegawai (milik sendiri) / admin (semua)
- **Auth:** JWT
- **Response:**
  - **200 OK**: File PDF (Content-Type: application/pdf, Content-Disposition: attachment)
  - **404 Not Found**: Jika permintaan tidak ditemukan

### DTO & Validasi

- [`CreatePermintaanDto`](src/permintaan/dto/create-permintaan.dto.ts): Validasi pengajuan permintaan (items wajib, id_barang & jumlah minimal 1)
- [`VerifikasiPermintaanDto`](src/permintaan/dto/verifikasi-permintaan.dto.ts): Validasi verifikasi permintaan (keputusan enum, items minimal 1, jumlah_disetujui >= 0)

### Error Handling

- **400 Bad Request**: Data tidak valid, stok tidak cukup, barang tidak aktif, permintaan sudah diverifikasi, jumlah_disetujui > jumlah_diminta
- **403 Forbidden**: Pegawai mengakses permintaan milik user lain
- **404 Not Found**: Permintaan tidak ditemukan
- **401 Unauthorized**: Tidak ada/invalid token

### Proteksi Endpoint

- Semua endpoint diproteksi JWT ([`JwtAuthGuard`](src/auth/jwt-auth.guard.ts))
- Endpoint pengajuan & riwayat hanya untuk role `pegawai`
- Endpoint verifikasi, dashboard, tren hanya untuk role `admin`
- Endpoint detail & PDF dapat diakses admin (semua) dan pegawai (hanya milik sendiri)

### Contoh Penggunaan

#### Pengajuan Permintaan

```http
POST /permintaan
Authorization: Bearer <token-pegawai>
Content-Type: application/json

{
  "items": [
    { "id_barang": 1, "jumlah": 2 },
    { "id_barang": 2, "jumlah": 1 }
  ],
  "catatan": "Untuk keperluan rapat bulanan"
}
```

#### Verifikasi Permintaan

```http
PATCH /permintaan/10/verifikasi
Authorization: Bearer <token-admin>
Content-Type: application/json

{
  "keputusan": "setuju",
  "items": [
    { "id_detail": 100, "jumlah_disetujui": 2 }
  ],
  "catatan_verifikasi": "Disetujui"
}
```

#### Cetak Bukti Permintaan (PDF)

```http
GET /permintaan/10/pdf
Authorization: Bearer <token>
```

### Unit Test

- [src/permintaan/permintaan.service.spec.ts](src/permintaan/permintaan.service.spec.ts)
- [src/permintaan/permintaan.controller.spec.ts](src/permintaan/permintaan.controller.spec.ts)
- [src/permintaan/dto/verifikasi-permintaan.dto.spec.ts](src/permintaan/dto/verifikasi-permintaan.dto.spec.ts)

### Referensi Kode

- Service: [`PermintaanService`](src/permintaan/permintaan.service.ts)
- Controller: [`PermintaanController`](src/permintaan/permintaan.controller.ts)
- DTO: [`CreatePermintaanDto`](src/permintaan/dto/create-permintaan.dto.ts), [`VerifikasiPermintaanDto`](src/permintaan/dto/verifikasi-permintaan.dto.ts)
- Modul: [`PermintaanModule`](src/permintaan/permintaan.module.ts)
