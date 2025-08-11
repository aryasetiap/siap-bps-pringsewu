# Dokumentasi API Autentikasi (Auth API)

Modul ini menyediakan endpoint untuk login dan logout pengguna menggunakan JWT.

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

### 2. Logout

- **URL:** `/auth/logout`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Response:**
  - **200 OK**
    ```json
    { "message": "Logout berhasil (token telah di-revoke)" }
    ```
  - **200 OK** (jika tidak ada token)
    ```json
    { "message": "No token provided" }
    ```

---

## Mekanisme

- Login menghasilkan JWT token yang digunakan untuk autentikasi pada endpoint lain.
- Logout akan memasukkan token ke blacklist sehingga tidak dapat digunakan lagi.

## Proteksi

- Gunakan [`JwtAuthGuard`](src/auth/jwt-auth.guard.ts) untuk melindungi endpoint.
- Gunakan decorator [`@Roles(...roles)`](src/auth/roles.decorator.ts) dan guard [`RolesGuard`](src/auth/roles.guard.ts) untuk membatasi akses berdasarkan role.

## Struktur Payload JWT

```json
{
  "sub": 1,
  "username": "admin",
  "role": "admin",
  "iat": 1690000000,
  "exp": 1690086400
}
```

## Error Handling

- **401 Unauthorized**: Token tidak valid, expired, atau sudah di-blacklist. Username/password salah saat login.
- **200 OK**: Logout tanpa token tetap mengembalikan pesan `"No token provided"`.

## Unit Test

- [src/auth/auth.service.spec.ts](src/auth/auth.service.spec.ts)
- [src/auth/auth.controller.spec.ts](src/auth/auth.controller.spec.ts)
- [src/auth/roles.guard.spec.ts](src/auth/roles.guard.spec.ts)

## Referensi Kode

- Service: [`AuthService`](src/auth/auth.service.ts)
- Controller: [`AuthController`](src/auth/auth.controller.ts)
- JWT Guard: [`JwtAuthGuard`](src/auth/jwt-auth.guard.ts)
- JWT Strategy: [`JwtStrategy`](src/auth/jwt.strategy.ts)
- Roles Guard: [`RolesGuard`](src/auth/roles.guard.ts)
