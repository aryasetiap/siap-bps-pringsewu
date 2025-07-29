# Dokumentasi API Autentikasi (Auth API)

Modul autentikasi menyediakan endpoint untuk login, logout, serta mekanisme proteksi endpoint menggunakan JWT dan role-based access control.

---

## Endpoint

### 1. Login

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

---

### 2. Logout

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

---

## Mekanisme Autentikasi

- **JWT (JSON Web Token):**
  - Token JWT di-generate saat login dan dikirimkan pada header `Authorization: Bearer <token>` untuk setiap request ke endpoint yang dilindungi.
  - Token memiliki masa berlaku (`expiresIn: 1d`).
  - Token yang sudah di-logout akan masuk blacklist dan tidak dapat digunakan lagi.

- **Proteksi Endpoint:**
  - Gunakan guard [`JwtAuthGuard`](jwt-auth.guard.ts) untuk melindungi endpoint (hanya user dengan token valid yang bisa mengakses).
  - Gunakan decorator [`@Roles(...roles)`](roles.decorator.ts) dan guard [`RolesGuard`](roles.guard.ts) untuk membatasi akses berdasarkan role (`admin` atau `pegawai`).

---

## Contoh Penggunaan

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "nama": "Admin SIAP"
  }
}
```

### Logout

```http
POST /auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
{ "message": "Logout success (token revoked)" }
```

---

## Middleware & Guard

- **JwtAuthGuard**  
  Melindungi endpoint dari akses tanpa token JWT yang valid.  
  Implementasi: [jwt-auth.guard.ts](jwt-auth.guard.ts)

- **RolesGuard**  
  Membatasi akses endpoint berdasarkan role user.  
  Implementasi: [roles.guard.ts](roles.guard.ts)

- **@Roles Decorator**  
  Menandai endpoint hanya bisa diakses oleh role tertentu.  
  Implementasi: [roles.decorator.ts](roles.decorator.ts)

---

## Struktur Payload JWT

Payload JWT yang di-generate:

```json
{
  "sub": 1,
  "username": "admin",
  "role": "admin",
  "iat": 1690000000,
  "exp": 1690086400
}
```

- `sub`: ID user
- `username`: Username user
- `role`: Role user (`admin` atau `pegawai`)
- `iat`: Issued at (timestamp)
- `exp`: Expired at (timestamp)

---

## Error Handling

- **401 Unauthorized**
  - Token tidak valid, expired, atau sudah di-blacklist.
  - Username/password salah saat login.

- **200 OK**
  - Logout tanpa token tetap mengembalikan pesan `"No token provided"`.

---

## Unit Test

- Terdapat pengujian unit untuk AuthService dan AuthController di:
  - [auth.service.spec.ts](auth.service.spec.ts)
  - [auth.controller.spec.ts](auth.controller.spec.ts)
- Pengujian guard role di:
  - [roles.guard.spec.ts](roles.guard.spec.ts)

---

## Dependensi

- JWT: [`@nestjs/jwt`](https://docs.nestjs.com/security/authentication#jwt-functionality)
- Hashing password: [`bcryptjs`](https://www.npmjs.com/package/bcryptjs)
- Role-based access: Custom decorator dan guard

---

## Referensi Kode

- Service utama: [`AuthService`](auth.service.ts)
- Controller: [`AuthController`](auth.controller.ts)
- JWT Guard: [`JwtAuthGuard`](jwt-auth.guard.ts)
- JWT Strategy: [`JwtStrategy`](jwt.strategy.ts)
- Roles Guard: [`RolesGuard`](roles.guard.ts)
-
