/**
 * barangService.js
 *
 * Modul ini menyediakan berbagai fungsi untuk pengelolaan data barang pada aplikasi SIAP.
 * Fungsi-fungsi di dalamnya meliputi pengambilan data barang, pembuatan, pembaruan, penghapusan,
 * penambahan stok, serta pengambilan laporan dan notifikasi terkait stok barang.
 *
 * Seluruh fungsi menggunakan instance `api` untuk berkomunikasi dengan backend melalui endpoint yang telah disediakan.
 * Setiap fungsi didokumentasikan dengan docstring berbahasa Indonesia untuk memudahkan pemahaman dan pengembangan lebih lanjut.
 */

import api from "./api";

const API_URL = "/barang";

/**
 * Mendapatkan daftar seluruh barang dari server dengan pagination.
 *
 * Parameter:
 * - params (Object): Parameter query untuk filter, pagination, dsb.
 *   - page (number): Nomor halaman
 *   - limit (number): Jumlah data per halaman
 *   - q (string): Kata kunci pencarian
 *   - status_aktif (boolean): Filter status aktif
 *   - stok_kritis (boolean): Filter stok kritis
 *   - paginate (boolean): Aktifkan pagination (default: true)
 *
 * Return:
 * - Promise: Resolusi berisi response data dengan pagination info.
 */
export const getAllBarang = (params = {}) => {
  /**
   * Fungsi ini digunakan untuk mengambil seluruh data barang dari backend.
   */
  return api.get(API_URL, { params });
};

/**
 * Mendapatkan daftar barang tanpa pagination.
 *
 * Parameter:
 * - params (Object): Parameter query untuk filter.
 *
 * Return:
 * - Promise: Resolusi berisi array data barang.
 */
export const getAllBarangWithoutPagination = (params = {}) => {
  /**
   * Fungsi ini digunakan untuk mengambil seluruh data barang dari backend tanpa pagination.
   */
  return api.get(API_URL, {
    params: {
      ...params,
      paginate: false,
    },
  });
};

/**
 * Mendapatkan detail barang berdasarkan ID barang.
 *
 * Parameter:
 * - id (number|string): ID unik barang.
 *
 * Return:
 * - Promise: Resolusi berisi data detail barang.
 */
export const getBarangById = (id) => {
  /**
   * Fungsi ini digunakan untuk mengambil detail barang berdasarkan ID.
   */
  return api.get(`${API_URL}/${id}`);
};

/**
 * Membuat barang baru pada sistem SIAP.
 *
 * Parameter:
 * - data (Object): Data barang yang akan dibuat (kode, nama, kategori, dsb).
 *
 * Return:
 * - Promise: Resolusi berisi data barang yang baru dibuat.
 */
export const createBarang = (data) => {
  /**
   * Fungsi ini digunakan untuk menambahkan barang baru ke database.
   */
  return api.post(API_URL, data);
};

/**
 * Memperbarui data barang secara parsial berdasarkan ID.
 *
 * Parameter:
 * - id (number|string): ID barang yang akan diperbarui.
 * - data (Object): Data parsial yang akan diupdate.
 *
 * Return:
 * - Promise: Resolusi berisi data barang yang telah diperbarui.
 */
export const updateBarang = (id, data) => {
  /**
   * Fungsi ini digunakan untuk memperbarui sebagian data barang.
   */
  return api.patch(`${API_URL}/${id}`, data);
};

/**
 * Menghapus (soft delete) barang dari sistem SIAP.
 *
 * Parameter:
 * - id (number|string): ID barang yang akan dihapus.
 *
 * Return:
 * - Promise: Resolusi berisi status penghapusan barang.
 */
export const deleteBarang = (id) => {
  /**
   * Fungsi ini digunakan untuk melakukan soft delete barang berdasarkan ID.
   */
  return api.delete(`${API_URL}/${id}`);
};

/**
 * Menambah stok barang berdasarkan ID barang.
 *
 * Parameter:
 * - id (number|string): ID barang yang akan ditambah stoknya.
 * - jumlah (number): Jumlah stok yang akan ditambahkan.
 *
 * Return:
 * - Promise: Resolusi berisi data barang setelah penambahan stok.
 */
export const tambahStok = (id, jumlah) => {
  /**
   * Fungsi ini digunakan untuk menambah stok barang tertentu.
   */
  return api.patch(`${API_URL}/${id}/add-stok`, { jumlah });
};

/**
 * Mendapatkan daftar barang dengan stok kritis (di bawah ambang batas minimum).
 *
 * Return:
 * - Promise: Resolusi berisi daftar barang dengan stok kritis.
 */
export const getBarangStokKritis = () => {
  /**
   * Fungsi ini digunakan untuk mengambil daftar barang yang stoknya berada di bawah ambang batas kritis.
   */
  return api.get(`${API_URL}/stok-kritis`);
};

/**
 * Mendapatkan notifikasi stok kritis untuk dashboard SIAP.
 *
 * Return:
 * - Promise: Resolusi berisi data notifikasi stok kritis.
 */
export const getNotifStokKritis = () => {
  /**
   * Fungsi ini digunakan untuk mengambil notifikasi stok kritis yang akan ditampilkan di dashboard.
   */
  return api.get(`${API_URL}/dashboard/notifikasi-stok-kritis`);
};

/**
 * Mendapatkan laporan penggunaan barang dalam format JSON.
 *
 * Parameter:
 * - queryParams (Object): Parameter query untuk filter laporan.
 *
 * Return:
 * - Promise: Resolusi berisi data laporan penggunaan barang (format JSON).
 */
export const getLaporanPenggunaanJSON = (queryParams) => {
  /**
   * Fungsi ini digunakan untuk mengambil laporan penggunaan barang dalam format JSON.
   */
  return api.get(`${API_URL}/laporan-penggunaan`, { params: queryParams });
};

/**
 * Mendapatkan laporan penggunaan barang dalam format PDF.
 *
 * Parameter:
 * - queryParams (Object): Parameter query untuk filter laporan.
 *
 * Return:
 * - Promise: Resolusi berisi file PDF (responseType: blob).
 */
export const getLaporanPenggunaanPDF = (queryParams) => {
  /**
   * Fungsi ini digunakan untuk mengambil laporan penggunaan barang dalam format PDF.
   * Response berupa blob agar dapat diunduh sebagai file PDF.
   */
  return api.get(`${API_URL}/laporan-penggunaan/pdf`, {
    responseType: "blob",
    params: queryParams,
  });
};

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
  /**
   * Fungsi ini digunakan untuk mengambil daftar barang yang tersedia untuk pegawai.
   * Data hasil response akan ditransformasi agar field lebih konsisten dan mudah digunakan di frontend pegawai.
   */
  const response = await api.get(`${API_URL}/available`, { params });

  // Transformasi data agar field lebih konsisten dan mudah digunakan di frontend pegawai
  const transformedData = response.data.map((item) => ({
    id: item.id,
    kode: item.kode_barang,
    nama: item.nama_barang,
    kategori: item.kategori || "-",
    stok: item.stok,
    satuan: item.satuan,
    stokMinimum: item.ambang_batas_kritis,
  }));

  return {
    ...response,
    data: transformedData,
  };
};
