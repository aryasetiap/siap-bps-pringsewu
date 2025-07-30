import api from "./api";

const API_URL = "/permintaan";

// Pengajuan permintaan barang (pegawai)
export const createPermintaan = (data) => api.post(API_URL, data);

// Melihat riwayat permintaan (pegawai)
export const getRiwayatPermintaan = () => api.get(`${API_URL}/riwayat`);

// Mendapatkan detail permintaan (pegawai: hanya milik sendiri, admin: semua)
export const getPermintaanById = (id) => api.get(`${API_URL}/${id}`);

// Mendapatkan file PDF bukti permintaan
export const getPermintaanPDF = (id, config = {}) =>
  api.get(`${API_URL}/${id}/pdf`, { responseType: "blob", ...config });
