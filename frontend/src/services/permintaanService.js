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
 * Parameter:
 * - data (Object): Data permintaan barang yang akan dikirim.
 *
 * Return:
 * - Promise: Hasil response dari API berupa data permintaan yang telah dibuat.
 */
export const createPermintaan = (data) => api.post(API_URL, data);

/**
 * Melihat riwayat permintaan barang oleh pegawai.
 *
 * Parameter:
 * - params (Object): Parameter filter atau pagination untuk riwayat permintaan.
 *
 * Return:
 * - Promise: Daftar riwayat permintaan barang sesuai filter.
 */
export const getRiwayatPermintaan = (params) =>
  api.get(`${API_URL}/riwayat`, { params });

/**
 * Mendapatkan daftar permintaan barang yang masuk untuk admin.
 *
 * Parameter:
 * - params (Object): Parameter filter atau pagination untuk permintaan masuk.
 *
 * Return:
 * - Promise: Daftar permintaan barang yang masuk.
 */
export const getPermintaanMasuk = (params) =>
  api.get(`${API_URL}/masuk`, { params });

/**
 * Mendapatkan detail permintaan barang berdasarkan ID.
 *
 * Parameter:
 * - id (string|number): ID permintaan barang.
 *
 * Return:
 * - Promise: Detail permintaan barang sesuai ID.
 */
export const getPermintaanById = (id) => api.get(`${API_URL}/${id}`);

/**
 * Memverifikasi permintaan barang oleh admin.
 *
 * Parameter:
 * - id (string|number): ID permintaan barang yang akan diverifikasi.
 * - data (Object): Data verifikasi (misal: status, catatan).
 *
 * Return:
 * - Promise: Hasil response dari API setelah verifikasi.
 */
export const verifikasiPermintaan = (id, data) =>
  api.patch(`${API_URL}/${id}/verifikasi`, data);

/**
 * Mendapatkan statistik dashboard permintaan barang untuk admin.
 *
 * Parameter:
 * - (tidak ada)
 *
 * Return:
 * - Promise: Data statistik permintaan barang untuk dashboard.
 */
export const getDashboardStatistik = () =>
  api.get(`${API_URL}/dashboard/statistik`);

/**
 * Mendapatkan tren permintaan barang bulanan.
 *
 * Parameter:
 * - (tidak ada)
 *
 * Return:
 * - Promise: Data tren permintaan barang bulanan.
 */
export const getTrenPermintaanBulanan = () =>
  api.get(`${API_URL}/dashboard/tren-permintaan`);

/**
 * Mendapatkan file PDF bukti permintaan barang berdasarkan ID.
 *
 * Parameter:
 * - id (string|number): ID permintaan barang.
 * - config (Object, optional): Konfigurasi tambahan untuk request (misal: headers).
 *
 * Return:
 * - Promise: File PDF dalam bentuk blob.
 */
export const getPermintaanPDF = (id, config = {}) =>
  api.get(`${API_URL}/${id}/pdf`, { responseType: "blob", ...config });

/**
 * Mendapatkan semua permintaan barang untuk admin.
 *
 * Parameter:
 * - params (Object, optional): Parameter filter atau pagination.
 *
 * Return:
 * - Promise: Daftar semua permintaan barang.
 */
export const getAllPermintaan = (params = {}) =>
  api.get(`${API_URL}/all`, { params });
