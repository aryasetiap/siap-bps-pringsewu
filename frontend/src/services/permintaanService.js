import api from "./api";

const API_URL = "/permintaan";

// 1. Membuat Permintaan Barang (pegawai)
export const createPermintaan = (data) => api.post(API_URL, data);

// 2. Melihat Riwayat Permintaan (pegawai)
export const getRiwayatPermintaan = () => api.get(`${API_URL}/riwayat`);

// 3. Daftar Permintaan Masuk (admin)
export const getPermintaanMasuk = () => api.get(`${API_URL}/masuk`);

// 4. Detail Permintaan (pegawai/admin)
export const getPermintaanById = (id) => api.get(`${API_URL}/${id}`);

// 5. Verifikasi Permintaan (admin)
export const verifikasiPermintaan = (id, data) =>
  api.patch(`${API_URL}/${id}/verifikasi`, data);

// 6. Statistik Dashboard Permintaan (admin)
export const getDashboardStatistik = () =>
  api.get(`${API_URL}/dashboard/statistik`);

// 7. Tren Permintaan Bulanan (admin)
export const getTrenPermintaanBulanan = () =>
  api.get(`${API_URL}/dashboard/tren-permintaan`);

// 8. Cetak Bukti Permintaan ke PDF (pegawai/admin)
export const getPermintaanPDF = (id, config = {}) =>
  api.get(`${API_URL}/${id}/pdf`, { responseType: "blob", ...config });

// 9. Mendapatkan Semua Permintaan (admin)
export const getAllPermintaan = (params = {}) =>
  api.get("/permintaan/all", { params });
