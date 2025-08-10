import api from "./api";

// Statistik dashboard (jumlah barang, permintaan tertunda, barang kritis)
export const getStats = () => api.get("/permintaan/dashboard/statistik");

// Grafik tren permintaan bulanan
export const getChart = () => api.get("/permintaan/dashboard/tren-permintaan");

// Notifikasi stok kritis (dashboard)
export const getNotifKritis = () =>
  api.get("/barang/dashboard/notifikasi-stok-kritis");

// Daftar permintaan terbaru (opsional, jika ada endpoint khusus)
export const getRecentRequests = () => {
  const role = localStorage.getItem("userRole");
  if (role === "admin") {
    return api.get("/permintaan/masuk"); // Untuk admin
  } else {
    return api.get("/permintaan/riwayat"); // Untuk pegawai
  }
};
