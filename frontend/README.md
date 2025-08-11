# 🚀 SIAP BPS Pringsewu - Frontend

**Sistem Aplikasi Pengelolaan Aset & Persediaan (SIAP)**  
Frontend aplikasi web untuk digitalisasi pengelolaan barang persediaan di BPS Kabupaten Pringsewu.  
Dibangun dengan [React.js](https://reactjs.org/) & [Tailwind CSS](https://tailwindcss.com/).

---

## ✨ Fitur Utama

- **🔐 Autentikasi & Manajemen Akun**  
   Login/logout, manajemen profil, upload foto profil, role-based akses (admin/pegawai).
- **📊 Dashboard Admin**  
   Statistik, grafik tren permintaan, notifikasi stok kritis, daftar permintaan terbaru.
- **📦 Manajemen Barang**  
   CRUD barang, tambah stok, filter stok kritis, aktivasi/deaktivasi.
- **👥 Manajemen Pengguna**  
   CRUD user, aktivasi/deaktivasi, filter & pencarian.
- **🛒 Pengajuan Permintaan**  
   Multi-item, pencarian barang, keranjang permintaan, validasi stok.
- **✅ Verifikasi Permintaan**  
   Review permintaan, setujui/tolak/sebagian, statistik permintaan.
- **📃 Laporan & PDF**  
   Laporan periodik, filter tanggal, ekspor PDF bukti permintaan.
- **📱 Responsive Design**  
   Kompatibel dengan desktop, tablet, & mobile.

---

## ⚙️ Tech Stack

| Kategori        | Teknologi                  |
| --------------- | -------------------------- |
| **Framework**   | React.js                   |
| **Styling**     | Tailwind CSS               |
| **Routing**     | React Router v7            |
| **State**       | React Context API          |
| **HTTP Client** | Axios                      |
| **UI**          | Headless UI, Heroicons     |
| **Charts**      | Chart.js + React-Chartjs-2 |
| **Notifikasi**  | React-Toastify             |

---

## 🚦 Instalasi & Menjalankan

1. **Clone repository**
   ```sh
   git clone <repo-url>
   cd frontend
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Konfigurasi environment**
   - Copy `.env.example` ke `.env` dan sesuaikan:
     ```
     REACT_APP_API_BASE_URL=http://localhost:3001/api
     ```
4. **Jalankan server development**
   ```sh
   npm start
   ```
   Frontend dapat diakses di [http://localhost:3000](http://localhost:3000)

---

## 📁 Struktur Folder

```text
src/
├── components/         # Komponen UI reusable
│   ├── barang/         # Barang
│   ├── common/         # Umum (ErrorPage, LoadingSpinner, dll)
│   ├── dashboard/      # Dashboard
│   ├── employee/       # Pegawai
│   ├── laporan/        # Laporan
│   ├── permintaan/     # Permintaan
│   ├── user/           # User
│   ├── DashboardLayout.jsx
│   ├── Headbar.jsx
│   └── Sidebar.jsx
├── context/            # React Context Providers
├── hooks/              # Custom Hooks
├── pages/              # Halaman aplikasi
│   ├── admin/          # Admin
│   ├── employee/       # Pegawai
│   └── ...             # Umum (Login, Error, dll)
├── services/           # Service API
├── App.js              # Root & routing
└── index.js            # Entry point
```

---

## 📑 Dokumentasi Halaman

### Halaman Umum

- **Login**: Autentikasi user dengan role-based access
- **Profile**: Edit data diri & password
- **Error Pages**: 404 Not Found, 403 Forbidden

### Halaman Admin

- **Dashboard**: Statistik, grafik, notifikasi stok kritis
- **Manajemen Barang**: CRUD, tambah stok, filter
- **Manajemen User**: CRUD, aktivasi/deaktivasi
- **Verifikasi Permintaan**: Review & verifikasi permintaan
- **Laporan Periodik**: Laporan penggunaan barang
- **Cetak Bukti Permintaan**: Preview & cetak PDF

### Halaman Pegawai

- **Pengajuan Permintaan**: Pencarian barang, keranjang, submit
- **Riwayat Permintaan**: Status tracking, download bukti

---

## 🛠️ Script Tersedia

| Script          | Fungsi                                         |
| --------------- | ---------------------------------------------- |
| `npm start`     | Jalankan server development                    |
| `npm run build` | Build project untuk production                 |
| `npm test`      | Jalankan test                                  |
| `npm run eject` | Eject dari create-react-app (tidak disarankan) |

---

## 🔑 Akses & Autentikasi

Aplikasi menggunakan JWT Authentication & role-based access:

- **Admin**
  - Username: `admin`
  - Password: `admin123`
  - Akses: Semua fitur
- **Pegawai**
  - Username: `pegawai`
  - Password: `pegawai123`
  - Akses: Permintaan barang, riwayat, profil

Token JWT disimpan di localStorage & dikirim via Authorization header.

---

## 💡 Best Practices

- Komponen modular & reusable
- State management dengan Context API
- Error handling global via axios interceptor
- Responsive design dengan Tailwind CSS
- Validasi form di client & server
- Loading states untuk operasi async

---

## 👨‍💻 Developer

**Arya Setia Pratama**  
[GitHub: aryasetiap](https://github.com/aryasetiap)  
WhatsApp: 085669644533

---

> **Kontribusi, bug report, & saran sangat terbuka!**  
> Jangan ragu untuk membuka issue atau pull request 🚀
