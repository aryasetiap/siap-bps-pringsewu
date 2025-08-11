/**
 * barangService.js
 *
 * Modul ini menyediakan berbagai fungsi untuk pengelolaan data barang pada aplikasi SIAP.
 * Fungsi-fungsi di dalamnya meliputi pengambilan data barang, pembuatan, pembaruan, penghapusan,
 * penambahan stok, serta pengambilan laporan dan notifikasi terkait stok barang.
 *
 * Seluruh fungsi menggunakan instance `api` untuk berkomunikasi dengan backend melalui endpoint yang telah disediakan.
 */

import api from "./api";

const API_URL = "/barang";

/**
 * Mendapatkan daftar barang dari server.
 *
 * Parameter:
 * - params (Object): Parameter query opsional untuk filter, pagination, dsb.
 *
 * Return:
 * - Promise: Resolusi berisi response data daftar barang.
 */
export const getAllBarang = (params) => api.get(API_URL, { params });

/**
 * Mendapatkan detail barang berdasarkan ID.
 *
 * Parameter:
 * - id (number|string): ID unik barang.
 *
 * Return:
 * - Promise: Resolusi berisi data detail barang.
 */
export const getBarangById = (id) => api.get(`${API_URL}/${id}`);

/**
 * Membuat barang baru pada sistem.
 *
 * Parameter:
 * - data (Object): Data barang yang akan dibuat (kode, nama, kategori, dsb).
 *
 * Return:
 * - Promise: Resolusi berisi data barang yang baru dibuat.
 */
export const createBarang = (data) => api.post(API_URL, data);

/**
 * Memperbarui data barang secara parsial.
 *
 * Parameter:
 * - id (number|string): ID barang yang akan diperbarui.
 * - data (Object): Data parsial yang akan diupdate.
 *
 * Return:
 * - Promise: Resolusi berisi data barang yang telah diperbarui.
 */
export const updateBarang = (id, data) => api.patch(`${API_URL}/${id}`, data);

/**
 * Menghapus (soft delete) barang dari sistem.
 *
 * Parameter:
 * - id (number|string): ID barang yang akan dihapus.
 *
 * Return:
 * - Promise: Resolusi berisi status penghapusan barang.
 */
export const deleteBarang = (id) => api.delete(`${API_URL}/${id}`);

/**
 * Menambah stok barang berdasarkan ID.
 *
 * Parameter:
 * - id (number|string): ID barang yang akan ditambah stoknya.
 * - jumlah (number): Jumlah stok yang akan ditambahkan.
 *
 * Return:
 * - Promise: Resolusi berisi data barang setelah penambahan stok.
 */
export const tambahStok = (id, jumlah) =>
  api.patch(`${API_URL}/${id}/add-stok`, { jumlah });

/**
 * Mendapatkan daftar barang dengan stok kritis (di bawah ambang batas minimum).
 *
 * Return:
 * - Promise: Resolusi berisi daftar barang dengan stok kritis.
 */
export const getBarangStokKritis = () => api.get(`${API_URL}/stok-kritis`);

/**
 * Mendapatkan notifikasi stok kritis untuk dashboard.
 *
 * Return:
 * - Promise: Resolusi berisi data notifikasi stok kritis.
 */
export const getNotifStokKritis = () =>
  api.get(`${API_URL}/dashboard/notifikasi-stok-kritis`);

/**
 * Mendapatkan laporan penggunaan barang dalam format JSON.
 *
 * Parameter:
 * - queryParams (Object): Parameter query untuk filter laporan.
 *
 * Return:
 * - Promise: Resolusi berisi data laporan penggunaan barang (format JSON).
 */
export const getLaporanPenggunaanJSON = (queryParams) =>
  api.get(`${API_URL}/laporan-penggunaan`, { params: queryParams });

/**
 * Mendapatkan laporan penggunaan barang dalam format PDF.
 *
 * Parameter:
 * - queryParams (Object): Parameter query untuk filter laporan.
 *
 * Return:
 * - Promise: Resolusi berisi file PDF (responseType: blob).
 */
export const getLaporanPenggunaanPDF = (queryParams) =>
  api.get(`${API_URL}/laporan-penggunaan/pdf`, {
    responseType: "blob",
    params: queryParams,
  });

/**
 * Mendapatkan daftar barang yang tersedia untuk pegawai.
 * Data yang diambil akan ditransformasi agar sesuai dengan kebutuhan frontend pegawai.
 *
 * Parameter:
 * - params (Object): Parameter query opsional untuk filter, pagination, dsb.
 *
 * Return:
 * - Promise: Resolusi berisi response dengan data barang yang telah ditransformasi.
 *
 * Catatan:
 * Transformasi dilakukan agar field sesuai dengan kebutuhan tampilan pegawai.
 */
export const getAllBarangForEmployee = async (params) => {
  const response = await api.get(`${API_URL}/available`, { params });
  // Transformasi data agar field lebih konsisten dan mudah digunakan di frontend pegawai
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
