import api from "./api";

const API_URL = "/barang";

// Mendapatkan daftar barang (dengan query opsional)
export const getAllBarang = (params) => api.get(API_URL, { params });

// Mendapatkan detail barang
export const getBarangById = (id) => api.get(`${API_URL}/${id}`);

// Membuat barang baru
export const createBarang = (data) => api.post(API_URL, data);

// Memperbarui data barang (parsial)
export const updateBarang = (id, data) => api.patch(`${API_URL}/${id}`, data);

// Menghapus (soft delete) barang
export const deleteBarang = (id) => api.delete(`${API_URL}/${id}`);

// Menambah stok barang
export const tambahStok = (id, jumlah) =>
  api.patch(`${API_URL}/${id}/add-stok`, { jumlah });

// Mendapatkan daftar barang stok kritis
export const getBarangStokKritis = () => api.get(`${API_URL}/stok-kritis`);

// Mendapatkan notifikasi stok kritis (dashboard)
export const getNotifStokKritis = () =>
  api.get(`${API_URL}/dashboard/notifikasi-stok-kritis`);

// Mendapatkan laporan penggunaan barang (PDF)
export const getLaporanPenggunaanPDF = (start, end, config = {}) =>
  api.get(`${API_URL}/laporan-penggunaan/pdf`, {
    params: { start, end },
    responseType: "blob",
    ...config,
  });
