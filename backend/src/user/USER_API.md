# Dokumentasi API User (User API)

Modul User menyediakan endpoint untuk manajemen data pengguna (admin & pegawai), termasuk CRUD, update profil, upload foto profil, serta proteksi endpoint berbasis role.

---

## Endpoint

### 1. Membuat User Baru (Admin)

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

---

### 2. Mengambil Daftar Seluruh User (Admin)

- **URL:** `/user`
- **Method:** `GET`
- **Role:** admin
- **Response:**
  - **200 OK**: Array data user

---

### 3. Mengambil Data User Berdasarkan ID (Admin)

- **URL:** `/user/:id`
- **Method:** `GET`
- **Role:** admin
- **Response:**
  - **200 OK**: Data user
  - **404 Not Found**: Jika user tidak ditemukan

---

### 4. Memperbarui Data User Berdasarkan ID (Admin)

- **URL:** `/user/:id`
- **Method:** `PATCH`
- **Role:** admin
- **Body:**  
  Field yang ingin diperbarui (parsial, lihat [UpdateUserDto](dto/update-user.dto.ts))
- **Response:**
  - **200 OK**: Data user yang telah diperbarui
  - **404 Not Found**: Jika user tidak ditemukan

---

### 5. Soft Delete User Berdasarkan ID (Admin)

- **URL:** `/user/:id`
- **Method:** `DELETE`
- **Role:** admin
- **Response:**
  - **200 OK**: User dengan `status_aktif: false`
  - **404 Not Found**: Jika user tidak ditemukan

---

### 6. Menghapus User Berdasarkan Username (Admin, untuk testing/dev)

- **URL:** `/user`
- **Method:** `DELETE`
- **Role:** admin
- **Body:**
  ```json
  { "username": "budi" }
  ```
- **Response:**
  - **200 OK**: User di-nonaktifkan atau pesan "User tidak ditemukan"

---

### 7. Mengambil Profil User yang Sedang Login

- **URL:** `/user/profile`
- **Method:** `GET`
- **Auth:** JWT
- **Response:**
  - **200 OK**: Data user yang sedang login

---

### 8. Memperbarui Profil User yang Sedang Login

- **URL:** `/user/profile`
- **Method:** `PATCH`
- **Auth:** JWT
- **Body:**  
  Field yang ingin diperbarui (parsial, lihat [UpdateUserDto](dto/update-user.dto.ts))
- **Response:**
  - **200 OK**: Data user yang telah diperbarui

---

### 9. Upload/Update Foto Profil User yang Sedang Login

- **URL:** `/user/profile/foto`
- **Method:** `PATCH`
- **Auth:** JWT
- **Form Data:**
  - `foto`: file (image/jpeg, image/png, image/webp, max 2MB)
- **Response:**
  - **200 OK**: Data user dengan path foto terbaru
  - **400 Bad Request**: Jika file bukan gambar atau melebihi batas ukuran

---

### 10. Endpoint Khusus Role

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

---

## DTO & Validasi

- [`CreateUserDto`](dto/create-user.dto.ts): Validasi pembuatan user baru (nama, username, password wajib, role opsional)
- [`UpdateUserDto`](dto/update-user.dto.ts): Validasi update user (semua field opsional, password otomatis di-hash jika diisi)

---

## Error Handling

- **400 Bad Request**: Username sudah terdaftar, file upload tidak valid
- **404 Not Found**: User tidak ditemukan
- **401 Unauthorized**: Tidak ada/invalid token
- **403 Forbidden**: Role tidak sesuai

---

## Proteksi Endpoint

- Semua endpoint diproteksi JWT (`AuthGuard('jwt')`)
- Endpoint CRUD hanya untuk role `admin` ([`RolesGuard`](../auth/roles.guard.ts))
- Endpoint profil dapat diakses user login (admin/pegawai)

---

## Contoh Penggunaan

### Membuat User Baru

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

### Update Profil User

```http
PATCH /user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "nama": "Budi S.",
  "password": "passwordBaru"
}
```

### Upload Foto Profil

```http
PATCH /user/profile/foto
Authorization: Bearer <token>
Content-Type: multipart/form-data

foto: <file>
```

---

## Unit Test

- Pengujian service: [user.service.spec.ts](user.service.spec.ts)
- Pengujian controller: [user.controller.spec.ts](user.controller.spec.ts)

---

## Referensi Kode

- Service: [`UserService`](user.service.ts)
- Controller: [`UserController`](user.controller.ts)
- DTO: [`CreateUserDto`](dto/create-user.dto.ts), [`UpdateUserDto`](dto/update-user.dto.ts)
- Modul:
