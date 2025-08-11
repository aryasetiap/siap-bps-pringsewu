# Dokumentasi API Barang (Barang API)

Modul Barang menyediakan endpoint untuk manajemen data barang persediaan, termasuk CRUD, penambahan stok, filter stok kritis, notifikasi, dan laporan penggunaan barang dalam format PDF.

---

## Endpoint

### 1. Membuat Barang Baru

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
    "foto": "https://example.com/kertas.jpg",
    "kategori": "ATK"
  }
  ```
- **Response:**
  - **201 Created**: Data barang yang berhasil dibuat
  - **400 Bad Request**: Jika kode_barang sudah terdaftar atau data tidak valid

---

### 2. Mendapatkan Daftar Barang

- **URL:** `/barang`
- **Method:** `GET`
- **Role:** admin, pegawai
- **Query Params (opsional):**
  - `q`: Pencarian nama/kode barang (string)
  - `status_aktif`: Filter status aktif (`true`/`false`)
  - `stok_kritis`: Filter barang stok kritis (`true`)
- **Response:**
  - **200 OK**: Array data barang

---

### 3. Mendapatkan Detail Barang

- **URL:** `/barang/:id`
- **Method:** `GET`
- **Role:** admin
- **Response:**
  - **200 OK**: Detail barang
  - **404 Not Found**: Jika barang tidak ditemukan

---

### 4. Memperbarui Data Barang

- **URL:** `/barang/:id`
- **Method:** `PATCH`
- **Role:** admin
- **Body:**  
  Field yang ingin diperbarui (parsial, lihat [UpdateBarangDto](src/barang/dto/update-barang.dto.ts))
- **Response:**
  - **200 OK**: Data barang yang telah diperbarui
  - **400 Bad Request**: Jika stok negatif
  - **404 Not Found**: Jika barang tidak ditemukan

---

### 5. Soft Delete Barang

- **URL:** `/barang/:id`
- **Method:** `DELETE`
- **Role:** admin
- **Response:**
  - **200 OK**: Barang dengan `status_aktif: false`
  - **404 Not Found**: Jika barang tidak ditemukan

---

### 6. Menambah Stok Barang

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

---

### 7. Mendapatkan Daftar Barang Stok Kritis

- **URL:** `/barang/stok-kritis`
- **Method:** `GET`
- **Role:** admin
- **Response:**
  - **200 OK**: Daftar barang dengan stok <= ambang_batas_kritis dan status_aktif

---

### 8. Notifikasi Stok Kritis (Dashboard)

- **URL:** `/barang/dashboard/notifikasi-stok-kritis`
- **Method:** `GET`
- **Role:** user login (admin/pegawai)
- **Response:**
  - **200 OK**: Daftar barang kritis, terurut stok naik

---

### 9. Laporan Penggunaan Barang (JSON)

- **URL:** `/barang/laporan-penggunaan`
- **Method:** `GET`
- **Role:** user login (admin/pegawai)
- **Query Params:**
  - `start`: Tanggal awal (YYYY-MM-DD)
  - `end`: Tanggal akhir (YYYY-MM-DD)
  - `unit_kerja`: (opsional) Unit kerja
- **Response:**
  - **200 OK**: Rekap penggunaan barang dalam periode tertentu
  - **400 Bad Request**: Format tanggal salah atau start > end

---

### 10. Laporan Penggunaan Barang (PDF)

- **URL:** `/barang/laporan-penggunaan/pdf`
- **Method:** `GET`
- **Role:** user login (admin/pegawai)
- **Query Params:**
  - `start`: Tanggal awal (YYYY-MM-DD)
  - `end`: Tanggal akhir (YYYY-MM-DD)
  - `unit_kerja`: (opsional) Unit kerja
- **Response:**
  - **200 OK**: File PDF (Content-Type: application/pdf)
  - **400 Bad Request**: Format tanggal salah atau start > end

---

### 11. Daftar Barang Aktif untuk Permintaan Pegawai

- **URL:** `/barang/available`
- **Method:** `GET`
- **Role:** pegawai
- **Response:**
  - **200 OK**: Daftar barang aktif yang dapat diminta pegawai

---

## Proteksi Endpoint

- Semua endpoint diproteksi JWT ([`JwtAuthGuard`](../auth/jwt-auth.guard.ts))
- Endpoint CRUD hanya untuk role `admin` ([`RolesGuard`](../auth/roles.guard.ts))
- Endpoint notifikasi/laporan PDF bisa diakses user login (admin/pegawai)

---

## DTO & Validasi

- [`CreateBarangDto`](dto/create-barang.dto.ts): Validasi pembuatan barang baru
- [`UpdateBarangDto`](dto/update-barang.dto.ts): Validasi update barang (parsial)
- [`AddStokDto`](dto/add-stok.dto.ts): Validasi penambahan stok (jumlah minimal 1)

---

## Error Handling

- **400 Bad Request**: Data tidak valid, stok/jumlah negatif, kode_barang duplikat, barang tidak aktif
- **404 Not Found**: Barang tidak ditemukan
- **401 Unauthorized**: Tidak ada/invalid token
- **403 Forbidden**: Role tidak sesuai

---

## Unit Test

- [src/barang/barang.service.spec.ts](src/barang/barang.service.spec.ts)
- [src/barang/barang.controller.spec.ts](src/barang/barang.controller.spec.ts)

---

## Referensi Kode

- Service: [`BarangService`](barang.service.ts)
- Controller: [`BarangController`](barang.controller.ts)
- DTO: [`CreateBarangDto`](dto/create-barang.dto.ts), [`UpdateBarangDto`](dto/update-barang.dto.ts),
