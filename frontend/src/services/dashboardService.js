/**
 * File ini berisi service untuk pengambilan data dashboard aplikasi SIAP.
 * Meliputi statistik barang, grafik tren permintaan, notifikasi stok kritis,
 * dan daftar permintaan terbaru berdasarkan peran pengguna.
 *
 * Semua fungsi di bawah menggunakan API utama yang telah dikonfigurasi.
 */

import api from "./api";

/**
 * Mengambil statistik dashboard terkait pengelolaan barang.
 *
 * Statistik meliputi jumlah barang, permintaan tertunda, dan barang kritis.
 *
 * Parameter: Tidak ada
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
 * Parameter: Tidak ada
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
 * Parameter: Tidak ada
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
 * Untuk admin, akan mengambil permintaan masuk yang perlu diverifikasi.
 * Untuk pegawai, akan mengambil riwayat permintaan yang telah diajukan.
 *
 * Parameter: Tidak ada (mengambil peran dari localStorage)
 *
 * Return:
 * - Promise<Object>: Daftar permintaan terbaru sesuai peran.
 */
export const getRecentRequests = () => {
  const userRole = localStorage.getItem("userRole");

  // Penentuan endpoint berdasarkan peran pengguna
  if (userRole === "admin") {
    // Endpoint khusus untuk admin: permintaan masuk yang perlu diverifikasi
    return api.get("/permintaan/masuk");
  } else {
    // Endpoint untuk pegawai: riwayat permintaan yang telah diajukan
    return api.get("/permintaan/riwayat");
  }
};
