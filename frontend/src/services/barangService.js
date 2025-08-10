import api from "./api";

// Mendapatkan daftar barang (dengan query opsional)
export const getAllBarang = (params) => api.get("/barang", { params });

// Mendapatkan detail barang
export const getBarangById = (id) => api.get(`/barang/${id}`);

// Membuat barang baru
export const createBarang = (data) => api.post("/barang", data);

// Memperbarui data barang (parsial)
export const updateBarang = (id, data) => api.patch(`/barang/${id}`, data);

// Menghapus (soft delete) barang
export const deleteBarang = (id) => api.delete(`/barang/${id}`);

// Menambah stok barang
export const tambahStok = (id, jumlah) =>
  api.patch(`/barang/${id}/add-stok`, { jumlah });

// Mendapatkan daftar barang stok kritis
export const getBarangStokKritis = () => api.get(`/barang/stok-kritis`);

// Mendapatkan notifikasi stok kritis (dashboard)
export const getNotifStokKritis = () =>
  api.get(`/barang/dashboard/notifikasi-stok-kritis`);

// Mendapatkan laporan penggunaan barang (PDF)
export const getLaporanPenggunaanPDF = (start, end, config = {}) =>
  api.get(`/barang/laporan-penggunaan/pdf`, {
    params: { start, end },
    responseType: "blob",
    ...config,
  });

// Mendapatkan rekap penggunaan barang (data, bukan PDF)
export const getLaporanPenggunaan = (start, end, config = {}) =>
  api.get(`/barang/laporan-penggunaan`, {
    params: { start, end },
    ...config,
  });
