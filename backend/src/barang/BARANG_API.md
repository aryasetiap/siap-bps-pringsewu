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
    "foto": "https://example.com/kertas.jpg"
  }
  ```
