# Dokumentasi API Permintaan Barang (Permintaan API)

Modul Permintaan menyediakan endpoint untuk pengajuan permintaan barang oleh pegawai, riwayat permintaan, verifikasi permintaan oleh admin, statistik dashboard, tren permintaan bulanan, dan cetak bukti permintaan ke PDF.

---

## Endpoint

### 1. Membuat Permintaan Barang

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
  - **201 Created**: Data permintaan beserta detail barang
  - **400 Bad Request**: Jika stok tidak cukup, barang tidak ditemukan, atau items kosong

---

### 2. Melihat Riwayat Permintaan (Pegawai)

- **URL:** `/permintaan/riwayat`
- **Method:** `GET`
- **Role:** pegawai
- **Auth:** JWT
- **Response:**
  - **200 OK**: Array riwayat permintaan user

---

### 3. Daftar Permintaan Masuk (Admin)

- **URL:** `/permintaan/masuk`
- **Method:** `GET`
- **Role:** admin
- **Auth:** JWT
- **Response:**
  - **200 OK**: Daftar permintaan status "Menunggu" beserta detail barang dan pemohon.

---

### 4. Detail Permintaan (Pegawai/Admin)

- **URL:** `/permintaan/:id`
- **Method:** `GET`
- **Role:** pegawai (hanya milik sendiri) / admin (semua)
- **Auth:** JWT
- **Response:**
  - **200 OK**: Data permintaan beserta detail barang, status, catatan, pemohon.
  - **403 Forbidden**: Jika pegawai mengakses permintaan milik user lain.
  - **404 Not Found**: Jika permintaan tidak ditemukan.

---

### 5. Verifikasi Permintaan (Admin)

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

---

### 6. Statistik Dashboard Permintaan (Admin)

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
    Mengembalikan statistik total barang, permintaan tertunda, barang kritis, dan total user aktif untuk dashboard admin.

---

### 7. Tren Permintaan Bulanan (Admin)

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

---

### 8. Cetak Bukti Permintaan ke PDF

- **URL:** `/permintaan/:id/pdf`
- **Method:** `GET`
- **Role:** pegawai (milik sendiri) / admin (semua)
- **Auth:** JWT
- **Response:**
  - **200 OK**: File PDF (Content-Type: application/pdf, Content-Disposition: attachment)
  - **404 Not Found**: Jika permintaan tidak ditemukan

---

### 9. Mendapatkan Semua Permintaan (Admin, untuk dashboard/tabel)

- **URL:** `/permintaan/all`
- **Method:** `GET`
- **Role:** admin
- **Auth:** JWT
- **Query Params:**
  - `status`: Filter status permintaan (opsional)
  - `page`: Nomor halaman (default: 1)
  - `limit`: Jumlah data per halaman (default: 20)
- **Response:**
  - **200 OK**: Data permintaan beserta info paginasi

---

## Proteksi Endpoint

- Semua endpoint diproteksi JWT ([`JwtAuthGuard`](../auth/jwt-auth.guard.ts))
- Endpoint pengajuan & riwayat hanya untuk role `pegawai`
- Endpoint verifikasi, dashboard, tren hanya untuk role `admin`
- Endpoint detail & PDF dapat diakses admin (semua) dan pegawai (hanya milik sendiri)

---

## DTO & Validasi

- [`CreatePermintaanDto`](dto/create-permintaan.dto.ts): Validasi pengajuan permintaan (items wajib, id_barang & jumlah minimal 1)
- [`VerifikasiPermintaanDto`](dto/verifikasi-permintaan.dto.ts): Validasi verifikasi permintaan (keputusan enum, items minimal 1, jumlah_disetujui >= 0)

---

## Error Handling

- **400 Bad Request**: Data tidak valid, stok tidak cukup, barang tidak aktif, permintaan sudah diverifikasi, jumlah_disetujui > jumlah_diminta
- **403 Forbidden**: Pegawai mengakses permintaan milik user lain
- **404 Not Found**: Permintaan tidak ditemukan
- **401 Unauthorized**: Tidak ada/invalid token

---

## Unit Test

- [src/permintaan/permintaan.service.spec.ts](src/permintaan/permintaan.service.spec.ts)
- [src/permintaan/permintaan.controller.spec.ts](src/permintaan/permintaan.controller.spec.ts)
- [src/permintaan/dto/verifikasi-permintaan.dto.spec.ts](src/permintaan/dto/verifikasi-permintaan.dto.spec.ts)

---

## Referensi Kode

- Service: [`PermintaanService`](permintaan.service.ts)
- Controller: [`PermintaanController`](permintaan.controller.ts)
- DTO: [`CreatePermintaanDto`](dto/create-permintaan.dto.ts), [`VerifikasiPermintaanDto`](dto/verifikasi-permintaan.dto.ts)
