/**
 * dashboardService.js
 *
 * Service ini digunakan untuk pengambilan data dashboard aplikasi SIAP.
 * Meliputi:
 * - Statistik barang
 * - Grafik tren permintaan bulanan
 * - Notifikasi stok kritis barang
 * - Daftar permintaan terbaru berdasarkan peran pengguna (admin/pegawai)
 *
 * Semua fungsi di bawah menggunakan API utama yang telah dikonfigurasi.
 */

import api from "./api";

/**
 * Mengambil statistik dashboard terkait pengelolaan barang.
 *
 * Statistik meliputi:
 * - Jumlah barang
 * - Permintaan tertunda
 * - Barang kritis
 *
 * Parameter:
 * - Tidak ada
 *
 * Return:
 * - Promise<Object>: Data statistik dashboard dari endpoint backend.
 */
export const getStats = () => {
  return api.get("/permintaan/dashboard/statistik");
};

/**
 * Mengambil data grafik tren permintaan bulanan barang.
 *
 * Data ini digunakan untuk menampilkan tren permintaan barang pada dashboard SIAP.
 *
 * Parameter:
 * - Tidak ada
 *
 * Return:
 * - Promise<Object>: Data tren permintaan bulanan dari backend.
 */
export const getChart = () => {
  return api.get("/permintaan/dashboard/tren-permintaan");
};

/**
 * Mengambil notifikasi stok kritis barang untuk dashboard.
 *
 * Notifikasi ini digunakan untuk memperingatkan admin/pegawai jika ada barang yang stoknya kritis.
 *
 * Parameter:
 * - Tidak ada
 *
 * Return:
 * - Promise<Object>: Daftar notifikasi stok kritis dari backend.
 */
export const getNotifKritis = () => {
  return api.get("/barang/dashboard/notifikasi-stok-kritis");
};

/**
 * Mengambil daftar permintaan terbaru sesuai peran pengguna.
 *
 * Untuk admin:
 * - Mengambil permintaan masuk yang perlu diverifikasi.
 * Untuk pegawai:
 * - Mengambil riwayat permintaan yang telah diajukan.
 *
 * Parameter:
 * - Tidak ada (mengambil peran dari localStorage)
 *
 * Return:
 * - Promise<Object>: Daftar permintaan terbaru sesuai peran.
 */
export const getRecentRequests = () => {
  const userRole = localStorage.getItem("userRole");

  // Penentuan endpoint berdasarkan peran pengguna
  switch (userRole) {
    case "admin":
      // Endpoint khusus untuk admin: permintaan masuk yang perlu diverifikasi
      return api.get("/permintaan/masuk");
    case "pegawai":
      // Endpoint untuk pegawai: riwayat permintaan yang telah diajukan
      return api.get("/permintaan/riwayat");
    default:
      // Jika peran tidak dikenali, kembalikan data kosong
      // Bisa dikembangkan untuk error handling lebih lanjut
      return Promise.resolve({ data: [] });
  }
};
