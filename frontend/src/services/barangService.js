import api from "./api";

const API_URL = "/barang";

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

// Mendapatkan laporan penggunaan barang dalam format JSON
export const getLaporanPenggunaanJSON = (queryParams) =>
  api.get(`${API_URL}/laporan-penggunaan`, { params: queryParams });

// Mendapatkan laporan penggunaan barang dalam format PDF
export const getLaporanPenggunaanPDF = (queryParams) =>
  api.get(`${API_URL}/laporan-penggunaan/pdf`, {
    responseType: "blob",
    params: queryParams,
  });

// barangService.js
// Gunakan endpoint yang tersedia untuk pegawai (jika ada)
export const getAllBarangForEmployee = async (params) => {
  const response = await api.get("/barang/available", { params });
  // Transform data jika diperlukan
  return {
    ...response,
    data: response.data.map((item) => ({
      id: item.id,
      kode: item.kode_barang,
      nama: item.nama_barang,
      kategori: item.kategori || "-",
      stok: item.stok,
      satuan: item.satuan,
      stokMinimum: item.ambang_batas_kritis,
    })),
  };
};
