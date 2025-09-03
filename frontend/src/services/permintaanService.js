/**
 * permintaanService.js
 *
 * Modul ini menyediakan fungsi-fungsi untuk mengelola permintaan barang pada aplikasi SIAP.
 * Fungsi-fungsi di bawah digunakan untuk membuat, melihat, memverifikasi, dan mendapatkan statistik permintaan barang.
 * Setiap fungsi telah didokumentasikan dengan penjelasan, parameter, dan outputnya.
 */

import api from "./api";

const API_URL = "/permintaan";

/**
 * Membuat permintaan barang oleh pegawai.
 *
 * Fungsi ini digunakan untuk membuat permintaan barang baru oleh pegawai.
 *
 * Parameter:
 * - data (Object): Data permintaan barang yang akan dikirim, berisi informasi barang dan kebutuhan.
 *
 * Return:
 * - Promise: Response dari API berupa data permintaan yang telah dibuat.
 */
export const createPermintaan = (data) => {
  return api.post(API_URL, data);
};

/**
 * Melihat riwayat permintaan barang oleh pegawai.
 *
 * Fungsi ini digunakan untuk mendapatkan daftar riwayat permintaan barang yang pernah diajukan oleh pegawai.
 *
 * Parameter:
 * - params (Object): Parameter filter atau pagination untuk riwayat permintaan.
 *
 * Return:
 * - Promise: Daftar riwayat permintaan barang sesuai filter.
 */
export const getRiwayatPermintaan = (params) => {
  return api.get(`${API_URL}/riwayat`, { params });
};

/**
 * Mendapatkan daftar permintaan barang yang masuk untuk admin.
 *
 * Fungsi ini digunakan oleh admin untuk melihat permintaan barang yang masuk dan perlu diproses.
 *
 * Parameter:
 * - params (Object): Parameter filter atau pagination untuk permintaan masuk.
 *
 * Return:
 * - Promise: Daftar permintaan barang yang masuk.
 */
export const getPermintaanMasuk = (params) => {
  return api.get(`${API_URL}/masuk`, { params });
};

/**
 * Mendapatkan detail permintaan barang berdasarkan ID.
 *
 * Fungsi ini digunakan untuk mengambil detail permintaan barang tertentu berdasarkan ID permintaan.
 *
 * Parameter:
 * - id (string|number): ID permintaan barang.
 *
 * Return:
 * - Promise: Detail permintaan barang sesuai ID.
 */
export const getPermintaanById = (id) => {
  return api.get(`${API_URL}/${id}`);
};

/**
 * Memverifikasi permintaan barang oleh admin.
 *
 * Fungsi ini digunakan oleh admin untuk memverifikasi permintaan barang, misalnya mengubah status atau menambahkan catatan.
 *
 * Parameter:
 * - id (string|number): ID permintaan barang yang akan diverifikasi.
 * - data (Object): Data verifikasi (misal: status, catatan).
 *
 * Return:
 * - Promise: Response dari API setelah verifikasi permintaan barang.
 */
export const verifikasiPermintaan = (id, data) => {
  return api.patch(`${API_URL}/${id}/verifikasi`, data);
};

/**
 * Mendapatkan statistik dashboard permintaan barang untuk admin.
 *
 * Fungsi ini digunakan untuk mengambil data statistik permintaan barang yang ditampilkan pada dashboard admin.
 *
 * Parameter:
 * - (tidak ada)
 *
 * Return:
 * - Promise: Data statistik permintaan barang untuk dashboard.
 */
export const getDashboardStatistik = () => {
  return api.get(`${API_URL}/dashboard/statistik`);
};

/**
 * Mendapatkan tren permintaan barang bulanan.
 *
 * Fungsi ini digunakan untuk mengambil data tren permintaan barang bulanan untuk analisis dan monitoring.
 *
 * Parameter:
 * - (tidak ada)
 *
 * Return:
 * - Promise: Data tren permintaan barang bulanan.
 */
export const getTrenPermintaanBulanan = () => {
  return api.get(`${API_URL}/dashboard/tren-permintaan`);
};

/**
 * Mendapatkan file PDF bukti permintaan barang berdasarkan ID.
 *
 * Fungsi ini digunakan untuk mengunduh file PDF sebagai bukti permintaan barang yang telah diajukan.
 *
 * Parameter:
 * - id (string|number): ID permintaan barang.
 * - config (Object, optional): Konfigurasi tambahan untuk request (misal: headers).
 *
 * Return:
 * - Promise: File PDF dalam bentuk blob.
 */
export const getPermintaanPDF = (id, config = {}) => {
  // Menggunakan responseType 'blob' untuk mendapatkan file PDF
  return api.get(`${API_URL}/${id}/pdf`, { responseType: "blob", ...config });
};

/**
 * Mendapatkan semua permintaan barang untuk admin.
 *
 * Fungsi ini digunakan oleh admin untuk mengambil seluruh data permintaan barang, dapat difilter atau dipaginasi.
 *
 * Parameter:
 * - params (Object, optional): Parameter filter atau pagination.
 *
 * Return:
 * - Promise: Daftar semua permintaan barang.
 */
export const getAllPermintaan = (params = {}) => {
  return api.get(`${API_URL}/all`, { params });
};
